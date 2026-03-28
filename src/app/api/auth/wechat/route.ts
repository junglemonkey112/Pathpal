import { NextRequest, NextResponse } from "next/server";

const WECHAT_APP_ID = process.env.WECHAT_APP_ID;
const WECHAT_APP_SECRET = process.env.WECHAT_APP_SECRET;

/**
 * GET /api/auth/wechat
 * Initiates WeChat OAuth flow by redirecting to WeChat authorization URL.
 * WeChat OAuth uses a custom flow since Supabase doesn't natively support WeChat.
 */
export async function GET(request: NextRequest) {
  if (!WECHAT_APP_ID) {
    return NextResponse.json(
      { error: "WeChat authentication is not configured. Set WECHAT_APP_ID in environment variables." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const redirectUri = searchParams.get("redirect_uri") ?? `${new URL(request.url).origin}/api/auth/wechat/callback`;

  // WeChat OAuth 2.0 authorization URL (for web/PC)
  const wechatAuthUrl = new URL("https://open.weixin.qq.com/connect/qrconnect");
  wechatAuthUrl.searchParams.set("appid", WECHAT_APP_ID);
  wechatAuthUrl.searchParams.set("redirect_uri", redirectUri);
  wechatAuthUrl.searchParams.set("response_type", "code");
  wechatAuthUrl.searchParams.set("scope", "snsapi_login");
  wechatAuthUrl.searchParams.set("state", crypto.randomUUID());

  return NextResponse.redirect(wechatAuthUrl.toString() + "#wechat_redirect");
}
