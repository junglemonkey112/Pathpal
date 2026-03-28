import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const WECHAT_APP_ID = process.env.WECHAT_APP_ID;

// Allowed redirect origins — only allow same-origin callbacks
const ALLOWED_CALLBACK_PATH = "/api/auth/wechat/callback";

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

  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}${ALLOWED_CALLBACK_PATH}`;

  // Generate and store state for CSRF protection
  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set("wechat_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  const wechatAuthUrl = new URL("https://open.weixin.qq.com/connect/qrconnect");
  wechatAuthUrl.searchParams.set("appid", WECHAT_APP_ID);
  wechatAuthUrl.searchParams.set("redirect_uri", redirectUri);
  wechatAuthUrl.searchParams.set("response_type", "code");
  wechatAuthUrl.searchParams.set("scope", "snsapi_login");
  wechatAuthUrl.searchParams.set("state", state);

  return NextResponse.redirect(wechatAuthUrl.toString() + "#wechat_redirect");
}
