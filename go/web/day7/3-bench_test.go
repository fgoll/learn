// 基准测试

package main

import "testing"

// go test -run x -bench .: -run 指定需要被执行的功能测试用例, 因为不存在名字为x 的功能测试用例
// 所以所有功能测试都不会被执行

func BenchmarkDecode(b *testing.B) {
	for i := 0; i < b.N; i ++ {
		decode("posts.json")
	}
}

func BenchmarkUnmarshal(b *testing.B) {
	for i := 0; i < b.N; i ++ {
		unmarshal("posts.json")
	}
}