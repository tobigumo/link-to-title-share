/**
 * Generic URL title fetching utility
 * Works with any URL, not limited to specific services
 */

export interface UrlInfo {
  title: string;
  url: string;
  description?: string;
}

/**
 * Fetch title from any URL by parsing HTML
 */
export async function fetchUrlTitle(url: string): Promise<UrlInfo | null> {
  try {
    // Validate URL
    const urlObj = new URL(url);
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      throw new Error("Only HTTP and HTTPS URLs are supported");
    }

    // For security, we'll use a CORS proxy or fetch through a service
    // In a real implementation, you might want to use your own backend
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status.toString()}`);
    }

    const html = await response.text();

    // Parse title from HTML
    const titleMatch = /<title[^>]*>(.*?)<\/title>/i.exec(html);
    const title = titleMatch?.[1]?.trim() ?? "Untitled";

    // Parse description from meta tags
    const descriptionMatch =
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i.exec(
        html,
      ) ??
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i.exec(
        html,
      );
    const description = descriptionMatch?.[1]?.trim();

    // Clean up HTML entities
    const cleanTitle = title
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");

    const cleanDescription = description
      ?.replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");

    return {
      title: cleanTitle,
      url,
      ...(cleanDescription && { description: cleanDescription }),
    };
  } catch (error) {
    console.error("Error fetching URL title:", error);
    return null;
  }
}

/**
 * Validate if a string is a valid URL
 */
export function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * Share content using Web Share API or fallback to clipboard
 */
export async function shareContent(
  text: string,
  url: string,
): Promise<boolean> {
  const shareData = {
    text,
    url,
  };

  if (
    "share" in navigator &&
    "canShare" in navigator &&
    navigator.canShare(shareData)
  ) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.warn("Web Share API failed, falling back to clipboard:", error);
        // Fall through to clipboard fallback
      } else {
        // User cancelled sharing
        return false;
      }
    }
  }

  // Fallback to clipboard
  return await copyToClipboard(`${text} ${url}`);
}

/**
 * Copy text to clipboard using modern Clipboard API
 * Returns true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // セキュアコンテキストチェック
  if (!window.isSecureContext) {
    console.warn("Clipboard API requires a secure context (HTTPS)");
    return false;
  }

  // Clipboard API利用可能チェック
  if (!("clipboard" in navigator)) {
    console.warn("Clipboard API not supported");
    return false;
  }

  try {
    // 権限チェック（オプション）
    const permission = await navigator.permissions.query({
      name: "clipboard-write" as PermissionName,
    });
    if (permission.state === "denied") {
      throw new Error("Clipboard access denied");
    }

    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}
