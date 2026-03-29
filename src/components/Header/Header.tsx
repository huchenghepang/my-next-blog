import {AppBar, Box, Container, Stack, Toolbar} from "@mui/material"
import Link from "next/link"
import ThemeMuiToggle from "../ThemeMuiToggle"
import HeaderClient from "./HeaderClient"
import Logo from "./Logo"

export default function Header() {
  return (
    <HeaderClient>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "transparent",
          transition: "all 0.3s",
          "&.scrolled": {
            backdropFilter: "blur(8px)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{justifyContent: "space-between", minHeight: "56px"}}
          >
            {/* Logo - 服务端渲染 */}
            <Logo link="/" title="返回首页" />

            {/* 桌面端导航 - 服务端渲染 */}
            <Stack
              direction="row"
              spacing={3}
              sx={{
                display: {xs: "none", md: "flex"},
                alignItems: "center",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  textDecoration: "none",
                  color: "text.primary",
                  fontWeight: 500,
                  "&:hover": {opacity: 0.7},
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Link href="/posts">文 章</Link>
              </Box>
              <Box
                sx={{
                  textDecoration: "none",
                  color: "text.primary",
                  fontWeight: 500,
                  "&:hover": {opacity: 0.7},
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Link
                  href="https://huchenghe.site"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  主 站
                </Link>
              </Box>
              <Box
                sx={{
                  textDecoration: "none",
                  color: "text.primary",
                  fontWeight: 500,
                  "&:hover": {opacity: 0.7},
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Link href="/about">关 于</Link>
              </Box>
            </Stack>

            {/* 右侧功能区 - 服务端渲染 */}
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
              <ThemeMuiToggle />
              {/* 移动端搜索按钮和桌面端搜索框通过客户端组件处理 */}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HeaderClient>
  )
}
