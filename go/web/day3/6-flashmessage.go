package main

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"time"
)

func setMessage(w http.ResponseWriter, r *http.Request) {
	msg := []byte("Hello world")

	c := http.Cookie{
		Name:  "flash",
		// 对msg进行base64url编码以此来满足响应首部对cookie值的url编码要求(如果cookie的值不包含空格或者百分比这样的特殊字符, 不进行编码也是可以的)
		Value: base64.URLEncoding.EncodeToString(msg),
	}

	http.SetCookie(w, &c)
}

func showMessage(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie("flash")
	// 如果没找到cookie err为http.ErrNoCookie
	if err != nil {
		if err == http.ErrNoCookie {
			fmt.Fprintln(w, "no message found")
		}
	} else {
		// 创建一个同名的cookie, MaxAge设为负数, Expires设为一个已经过去的时间, 实际上就是完全移除这个cookie
		// 设置了Expires的cookie通常称为持久cookie, 这种cookie会一直存在, 直到指定的过期时间或者手动被删除
		// MaxAge指明cookie在浏览器创建后能存活多少秒
		rc := http.Cookie{
			Name:    "flash",
			MaxAge:  -1,
			Expires: time.Unix(1, 0),
		}
		http.SetCookie(w, &rc)
		val, _ := base64.URLEncoding.DecodeString(c.Value)
		fmt.Fprintln(w, string(val))
	}
}

func main() {
	server := http.Server{
		Addr: "127.0.0.1:8888",
	}

	http.HandleFunc("/set_message", setMessage)
	http.HandleFunc("/show_message", showMessage)
	server.ListenAndServe()
}