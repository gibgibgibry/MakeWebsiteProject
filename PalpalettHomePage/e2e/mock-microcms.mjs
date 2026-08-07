/**
 * e2e 用の microCMS モックサーバー。
 *
 * なぜモックHTTPサーバーなのか:
 *   microCMS への fetch は「ビルド時 / Node サーバー側」で走るため、Playwright の
 *   page.route（ブラウザのリクエストしか横取りできない）では届かない。
 *   一方、データ層のモジュールを差し替える方式だと、いちばん壊れやすい fetch 周りと
 *   Next.js のキャッシュ／タグ機構がまったく検証されない。
 *   MICROCMS_BASE_URL をこのサーバーに向けることで、本番と同じコードパスを
 *   そのまま走らせつつ、内容は決定論的に固定できる。
 *
 * 制御用エンドポイント（テストからデータを差し替えるため）:
 *   POST /__mock/works  … 作品データを差し替える
 *   POST /__mock/reset  … フィクスチャの初期状態に戻す
 *   GET  /__mock/health … Playwright の待受け確認用
 */
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.MOCK_PORT ?? 4010);

const readFixture = (name) =>
  JSON.parse(readFileSync(join(here, "fixtures", name), "utf8"));

const INITIAL_WORKS = readFixture("works.json");
const INITIAL_CATEGORIES = readFixture("categories.json");

let works = structuredClone(INITIAL_WORKS);
let categories = structuredClone(INITIAL_CATEGORIES);

/** 1x1 の透明PNG。next/image の最適化が実際に走るので、
 *  中身は「正しい画像バイト列」である必要がある（寸法はCMS側のwidth/heightを使う）。 */
const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

const json = (res, status, body) => {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(payload);
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });

/** microCMS の `fields` クエリを再現する。指定が無ければ全フィールド返す。 */
const projectFields = (item, fields) => {
  if (!fields) return item;
  const keep = new Set(fields.split(",").map((f) => f.trim()));
  return Object.fromEntries(
    Object.entries(item).filter(([key]) => keep.has(key)),
  );
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const { pathname } = url;

  // ---- 制御用 -------------------------------------------------------------
  if (pathname === "/__mock/health") {
    return json(res, 200, { ok: true, works: works.contents.length });
  }

  if (pathname === "/__mock/reset" && req.method === "POST") {
    works = structuredClone(INITIAL_WORKS);
    categories = structuredClone(INITIAL_CATEGORIES);
    return json(res, 200, { ok: true });
  }

  if (pathname === "/__mock/works" && req.method === "POST") {
    try {
      const contents = JSON.parse(await readBody(req));
      works = {
        contents,
        totalCount: contents.length,
        offset: 0,
        limit: 100,
      };
      return json(res, 200, { ok: true, count: contents.length });
    } catch {
      return json(res, 400, { message: "invalid json" });
    }
  }

  // ---- 画像 ---------------------------------------------------------------
  if (pathname.startsWith("/assets/")) {
    res.writeHead(200, {
      "content-type": "image/png",
      "content-length": PNG_1X1.length,
      "cache-control": "public, max-age=31536000, immutable",
    });
    return res.end(PNG_1X1);
  }

  // ---- microCMS 互換API ---------------------------------------------------
  // 本物と同じく APIキーを要求する。ヘッダの付け忘れをテストで検出できるようにするため。
  if (pathname.startsWith("/api/v1/")) {
    if (!req.headers["x-microcms-api-key"]) {
      return json(res, 401, { message: "X-MICROCMS-API-KEY is required" });
    }

    const fields = url.searchParams.get("fields") ?? undefined;
    const rest = pathname.slice("/api/v1/".length);
    const [endpoint, contentId] = rest.split("/");

    const source =
      endpoint === "works" ? works : endpoint === "categories" ? categories : null;

    if (!source) return json(res, 404, { message: "endpoint not found" });

    if (contentId) {
      const found = source.contents.find((item) => item.id === contentId);
      if (!found) {
        return json(res, 404, {
          message: "The content is not found. Please check the content ID.",
        });
      }
      return json(res, 200, projectFields(found, fields));
    }

    const limit = Number(url.searchParams.get("limit") ?? 10);
    const offset = Number(url.searchParams.get("offset") ?? 0);
    const page = source.contents.slice(offset, offset + limit);

    return json(res, 200, {
      contents: page.map((item) => projectFields(item, fields)),
      totalCount: source.contents.length,
      offset,
      limit,
    });
  }

  return json(res, 404, { message: "not found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[mock-microcms] listening on http://127.0.0.1:${PORT}`);
});
