import React, { useCallback, useEffect, useState } from "react";

import styles from "../css/App.module.css";
import type { UrlInfo } from "../utils/urlUtils";
import {
  copyToClipboard,
  fetchUrlTitle,
  isValidUrl,
  shareContent,
} from "../utils/urlUtils";

const App: React.FC = () => {
  const [urlInput, setUrlInput] = useState<string>("");
  const [urlInfo, setUrlInfo] = useState<UrlInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [sharedData, setSharedData] = useState<{
    originalUrl?: string;
    originalTitle?: string;
    originalText?: string;
    normalizedUrl: string;
    normalizedTitle: string;
  } | null>(null);

  // 共有データを正規化する関数
  const normalizeSharedData = useCallback(
    (
      url?: string | null,
      title?: string | null,
      text?: string | null,
    ): { normalizedUrl: string; normalizedTitle: string } | null => {
      if (!url && !title && !text) return null;

      let normalizedUrl: string;
      let normalizedTitle: string;

      if (url) {
        // urlが入っている場合、urlをそのまま使用
        normalizedUrl = url;
        if (title) {
          // titleがある場合はtextをtitle
          normalizedTitle = text ?? title;
        } else {
          // titleがない場合はtextをそのまま使用
          normalizedTitle = text ?? "";
        }
      } else {
        // urlがない場合、textをurl
        normalizedUrl = text ?? "";
        // titleがある場合はtitleをtext
        normalizedTitle = title ?? "";
      }

      return { normalizedUrl, normalizedTitle };
    },
    [],
  );

  const checkForSharedContent = useCallback((): void => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedUrl = urlParams.get("url");
    const sharedTitle = urlParams.get("title");
    const sharedText = urlParams.get("text");

    if (sharedUrl || sharedTitle || sharedText) {
      const normalized = normalizeSharedData(
        sharedUrl,
        sharedTitle,
        sharedText,
      );
      if (normalized) {
        setSharedData({
          originalUrl: sharedUrl ?? undefined,
          originalTitle: sharedTitle ?? undefined,
          originalText: sharedText ?? undefined,
          normalizedUrl: normalized.normalizedUrl,
          normalizedTitle: normalized.normalizedTitle,
        });

        // 正規化されたURLを入力フィールドに設定
        if (normalized.normalizedUrl && isValidUrl(normalized.normalizedUrl)) {
          setUrlInput(normalized.normalizedUrl);
        }
      }
    }
  }, [normalizeSharedData]);

  const fetchTitle = useCallback(
    async (url?: string): Promise<void> => {
      const targetUrl = url ?? urlInput;

      if (!targetUrl.trim()) {
        setError("URLを入力してください");
        return;
      }

      if (!isValidUrl(targetUrl)) {
        setError("有効なURLを入力してください");
        return;
      }

      setLoading(true);
      setError("");
      setUrlInfo(null);

      try {
        const info = await fetchUrlTitle(targetUrl);
        if (info) {
          setUrlInfo(info);

          // 共有されたURLのタイトルを取得した場合、正規化されたタイトルを更新
          if (
            sharedData?.normalizedUrl === targetUrl &&
            !sharedData.normalizedTitle
          ) {
            setSharedData((prev) =>
              prev ? { ...prev, normalizedTitle: info.title } : null,
            );
          }
        } else {
          setError("タイトルの取得に失敗しました");
        }
      } catch (err) {
        setError(
          "エラーが発生しました: " +
            (err instanceof Error ? err.message : String(err)),
        );
      } finally {
        setLoading(false);
      }
    },
    [urlInput, sharedData],
  );

  // Check for shared content on app load
  useEffect(() => {
    checkForSharedContent();
  }, [checkForSharedContent]);

  // Auto-fetch title when normalized URL is shared without title
  useEffect(() => {
    if (
      sharedData?.normalizedUrl &&
      !sharedData.normalizedTitle &&
      isValidUrl(sharedData.normalizedUrl)
    ) {
      void fetchTitle(sharedData.normalizedUrl);
    }
  }, [sharedData, fetchTitle]);

  const handleShare = useCallback((): void => {
    if (!urlInfo) return;

    void (async (): Promise<void> => {
      try {
        const shared = await shareContent(urlInfo.title, urlInfo.url);
        if (!shared) {
          alert("共有がキャンセルされました");
        }
      } catch (error) {
        console.error("Share failed:", error);
        alert("共有に失敗しました");
      }
    })();
  }, [urlInfo]);

  const handleCopy = useCallback((): void => {
    if (!urlInfo) return;

    void (async (): Promise<void> => {
      const content = `${urlInfo.title}\n${urlInfo.url}`;
      const copied = await copyToClipboard(content);
      if (copied) {
        alert("クリップボードにコピーしました！");
      } else {
        alert("コピーに失敗しました");
      }
    })();
  }, [urlInfo]);

  // 正規化されたデータを共有する関数
  const handleShareNormalized = useCallback((): void => {
    if (!sharedData) return;

    void (async (): Promise<void> => {
      try {
        const shared = await shareContent(
          sharedData.normalizedTitle,
          sharedData.normalizedUrl,
        );
        if (!shared) {
          alert("共有がキャンセルされました");
        }
      } catch (error) {
        console.error("Share failed:", error);
        alert("共有に失敗しました");
      }
    })();
  }, [sharedData]);

  // 正規化されたデータをコピーする関数
  const handleCopyNormalized = useCallback((): void => {
    if (!sharedData) return;

    void (async (): Promise<void> => {
      const content = sharedData.normalizedTitle
        ? `${sharedData.normalizedTitle}\n${sharedData.normalizedUrl}`
        : sharedData.normalizedUrl;
      const copied = await copyToClipboard(content);
      if (copied) {
        alert("クリップボードにコピーしました！");
      } else {
        alert("コピーに失敗しました");
      }
    })();
  }, [sharedData]);

  const generateTestLink = useCallback(
    (params: { url?: string; title?: string; text?: string }): string => {
      const urlParams = new URLSearchParams();
      if (params.url) urlParams.set("url", params.url);
      if (params.title) urlParams.set("title", params.title);
      if (params.text) urlParams.set("text", params.text);
      return `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
    },
    [],
  );

  const testCases = [
    {
      name: "URL + Text + Title",
      params: {
        url: "https://example.com",
        text: "Example Site",
        title: "Site Title",
      },
    },
    {
      name: "Text as URL + Title",
      params: { text: "https://github.com", title: "GitHub" },
    },
    {
      name: "URL + Text (no title)",
      params: { url: "https://stackoverflow.com", text: "Stack Overflow" },
    },
    {
      name: "Only Text as URL",
      params: { text: "https://developer.mozilla.org" },
    },
    { name: "Only URL", params: { url: "https://reactjs.org" } },
  ];

  const handleSubmit = useCallback(
    (e: React.FormEvent): void => {
      e.preventDefault();
      void fetchTitle();
    },
    [fetchTitle],
  );

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Link to Title Share</h1>
        <p>URLからタイトルを取得して共有</p>
      </header>

      <main className={styles.main}>
        {sharedData && (
          <div className={styles.sharedContent}>
            <h2>共有されたコンテンツ</h2>
            <div className={styles.sharedParams}>
              <div className={styles.sharedParam}>
                <strong>正規化後のURL:</strong>
                <span>{sharedData.normalizedUrl}</span>
              </div>
              <div className={styles.sharedParam}>
                <strong>正規化後のタイトル:</strong>
                <span>{sharedData.normalizedTitle || "（タイトルなし）"}</span>
              </div>

              <div className={styles.actions}>
                <button onClick={handleShareNormalized} type="button">
                  正規化データを共有
                </button>
                <button onClick={handleCopyNormalized} type="button">
                  正規化データをコピー
                </button>
              </div>

              <h3>元の共有データ:</h3>
              {sharedData.originalUrl && (
                <div className={styles.sharedParam}>
                  <strong>元のURL:</strong>
                  <span>{sharedData.originalUrl}</span>
                </div>
              )}
              {sharedData.originalTitle && (
                <div className={styles.sharedParam}>
                  <strong>元のタイトル:</strong>
                  <span>{sharedData.originalTitle}</span>
                </div>
              )}
              {sharedData.originalText && (
                <div className={styles.sharedParam}>
                  <strong>元のテキスト:</strong>
                  <span>{sharedData.originalText}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="url">URL</label>
            <input
              id="url"
              type="url"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
              }}
              placeholder="URLを入力してください (例: https://example.com)"
              className={styles.urlInput}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !urlInput.trim()}>
              {loading ? "取得中..." : "タイトル取得"}
            </button>
          </div>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        {urlInfo && (
          <div className={styles.result}>
            <h2>結果</h2>
            <div className={styles.urlInfo}>
              <h3>{urlInfo.title}</h3>
              <a href={urlInfo.url} target="_blank" rel="noopener noreferrer">
                {urlInfo.url}
              </a>
            </div>
            <div className={styles.actions}>
              <button onClick={handleShare} type="button">
                共有
              </button>
              <button onClick={handleCopy} type="button">
                コピー
              </button>
            </div>
          </div>
        )}

        <div className={styles.testLinks}>
          <h2>テスト用リンクジェネレーター</h2>
          {testCases.map((testCase, index) => (
            <div key={index} className={styles.testCase}>
              <strong>{testCase.name}:</strong>
              <a
                href={generateTestLink(testCase.params)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {generateTestLink(testCase.params)}
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
