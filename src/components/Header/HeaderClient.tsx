"use client"
import throttle from "@/utils/throttle"
import CloseIcon from "@mui/icons-material/Close"
import MenuIcon from "@mui/icons-material/Menu"
import SearchIcon from "@mui/icons-material/Search"
import {
  Box,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import Link from "next/link"
import {
  cloneElement,
  isValidElement,
  ReactElement,
  type ReactNode,
  useEffect,
  useState,
} from "react"

interface HeaderClientProps {
  children: ReactNode
}

export default function HeaderClient({children}: HeaderClientProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // 滚动监听
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 0)
      setIsHidden(scrollY > window.innerHeight)
    }, 1000)

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 控制 body 滚动
  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen, searchOpen])

  // 安全地克隆 children 并添加滚动样式
  const enhancedChildren = (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        transform: isHidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      {isValidElement(children)
        ? // 如果是有效的 React 元素，克隆并添加 className
          cloneElement(
            children as ReactElement<{
              className?: string
            }>,
            {
              className: isScrolled ? "scrolled" : "",
            },
          )
        : // 如果不是，直接返回 children
          children}
    </Box>
  )

  return (
    <>
      {enhancedChildren}

      {/* 移动端搜索框 */}
      {isMobile && (
        <Drawer
          anchor="top"
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: "background.paper",
                p: 2,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
              },
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                flex: 1,
                boxShadow: "none",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="搜索文章..."
                autoFocus
              />
              <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
            <IconButton onClick={() => setSearchOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Drawer>
      )}

      {/* 移动端菜单抽屉 */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        slotProps={{
          paper: {
            sx: { width: "70%", maxWidth: 280 },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <List>
            <ListItem
              component={Link}
              href="/post"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ListItemText primary="文 章" />
            </ListItem>
            <ListItem
              component="a"
              href="https://huchenghe.site"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ListItemText primary="主 站" />
            </ListItem>
            <ListItem
              component={Link}
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ListItemText primary="关 于" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* 移动端控制按钮组 */}
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            bottom: 86,
            left: 16,
            zIndex: 1000,
            display: "flex",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <IconButton
            onClick={() => setSearchOpen(true)}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": { backgroundColor: "primary.dark" },
              boxShadow: 3,
            }}
          >
            <SearchIcon />
          </IconButton>
          <IconButton
            onClick={() => setMobileMenuOpen(true)}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": { backgroundColor: "primary.dark" },
              boxShadow: 3,
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}
    </>
  );
}
