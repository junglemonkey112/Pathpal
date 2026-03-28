import { NextRequest, NextResponse } from "next/server";

const WECHAT_APP_ID = process.env.WECHAT_APP_ID;
const WECHAT_APP_SECRET = process.env.WECHAT_APP_SECRET;

/**
 * GET /api/auth/wechat/callback
 * Handles WeChat OAuth callback — exchanges code for access_token + openid,
 * then creates/updates a Supabase user session.
 *
 * Note: Requires WECHAT_APP_ID and WECHAT_APP_SECRET env vars.
 * Full Supabase integration requires a custom auth provider setup.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=wechat_denied`);
  }

  if (!WECHAT_APP_ID || !WECHAT_APP_SECRET) {
    return NextResponse.redirect(`${origin}/login?error=wechat_not_configured`);
  }

  try {
    // Step 1: Exchange code for access_token
    const tokenUrl = new URL("https://api.weixin.qq.com/sns/oauth2/access_token");
    tokenUrl.searchParams.set("appid", WECHAT_APP_ID);
    tokenUrl.searchParams.set("secret", WECHAT_APP_SECRET);
    tokenUrl.searchParams.set("code", code);
    tokenUrl.searchParams.set("grant_type", "authorization_code");

    const tokenRes = await fetch(tokenUrl.toString());
    const tokenData = await tokenRes.json();

    if (tokenData.errcode) {
      console.error("WeChat token error:", tokenData);
      return NextResponse.redirect(`${origin}/login?error=wechat_token_failed`);
    }

    const { access_token, openid } = tokenData;

    // Step 2: Fetch user info
    const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
    const userInfoRes = await fetch(userInfoUrl);
    const userInfo = await userInfoRes.json();

    if (userInfo.errcode) {
      console.error("WeChat user info error:", userInfo);
      return NextResponse.redirect(`${origin}/login?error=wechat_userinfo_failed`);
    }

    // Step 3: At this point in production, you would:
    // - Look up or create a Supabase user with wechat_openid = openid
    // - Create a Supabase session token and set a cookie
    // - Redirect to home with the session
    //
    // For now, redirect with the openid as a query param (demo only)
    console.log("WeChat login successful:", { openid, nickname: userInfo.nickname });

    // Redirect to home — in production this would set a session cookie
    return NextResponse.redirect(`${origin}/?wechat_login=success&nickname=${encodeURIComponent(userInfo.nickname ?? "")}`);

  } catch (err) {
    console.error("WeChat callback error:", err);
    return NextResponse.redirect(`${origin}/login?error=wechat_error`);
  }
}
