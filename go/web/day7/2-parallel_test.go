package main

import (
	"testing"
	"time"
)

// go test -v -short -parallel 3: -parallel 指示以并行方式运行, 	3 表示希望最多运行3个测试用例

func TestParallel_1(t *testing.T) {
	t.Parallel()
	time.Sleep(1 * time.Second)
}

func TestParallel_2(t *testing.T) {
	t.Parallel()
	time.Sleep(2 * time.Second)
}

func TestParallel_3(t *testing.T) {
	t.Parallel()
	time.Sleep(3 * time.Second)
}


