package main

import (
	"testing"
	"time"
)

// go test: 会执行当前目录中名字以_test.go为后缀的所有文件
// go test -v -cover: -cover来获知测试用例对代码的覆盖率

func TestDecode(t *testing.T) {
	post, err := decode("posts.json")
	if err != nil {
		t.Error(err)
	}
	if post.Id != 1 {
		t.Error("Wrong id, was expecting 1 bug got", post.Id)
	}
	if post.Content != "Hello World!" {
		t.Error("Wrong content, was expecting 'Hello World!', but got", post.Content)
	}
}

func TestEncode(t *testing.T) {
	t.Skip("Skipping encoding for now")
}

// go test -v -short -cover: 不使用-short将会休眠10s
func TestLongRunningTest(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping long-running test in short mode")
	}
	time.Sleep(10 * time.Second)
}
