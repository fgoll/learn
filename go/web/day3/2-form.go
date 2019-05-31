// Go 和 HTML表单

// 表单的内容类型(content type) 决定了POST请求在发送键值对时将使用何种格式,
// 其中表单的内容类型是由表单的enctype属性决定的
// enctype属性的默认值为 application/x-www-form-urlencoded.
// 浏览器至少需要支持application/x-www-form-urlencoded 和 multipart/form-data

// 如果enctype属性的值设置为application/x-www-form-urlencoded, 那么浏览器将HTML表单中的
// 数据编码为一个连续的 "长查询字符串": 不同的键值对用&符合分隔, 而键值对中的键和值则使用等号=分隔.
//			firstname=sausheong&lastname=change

// 如果enctype属性值设为multipart/form-data, 那么表单中的数据将被转换成一条MIME报文:
//			------WebKitFormBoundaryMPNjKpeO9cLiocMw
//			Content-Disposition: form-data; name="firstname"
//
//			sausheong
//			------WebKitFormBoundaryMPNjKpeO9cLiocMw
//			Content-Disposition: form-data; name="lastname"
//
//			change
//			------WebKitFormBoundaryMPNjKpeO9cLiocMw--
//
//	如果表单传送的是简单的文本数据, 那么使用URL编码格式更好(更为简单高效)
//	如果表单需要传送大量数据(如上传文件)那么使用multipart/form-data会更好一些.

package main

import (
	"fmt"
	"net/http"
)

func process(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	fmt.Fprintln(w, r.Form)

	// 为了取得multipart/form-data编码的表单数据, 我们需要用到Request结构的ParseMultipartForm方法
	// 和MultipartForm字段, 而不再使用ParseForm和Form字段

	// 从multipart编码的表单里取出多少字节的数据
	r.ParseMultipartForm(1024)
	fmt.Fprintln(w, r.MultipartForm)
}

func main() {
	server := http.Server{
		Addr: "127.0.0.1:8888",
	}
	http.HandleFunc("/process", process)
	server.ListenAndServe()
}
