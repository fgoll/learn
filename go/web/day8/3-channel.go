package main

import (
	"fmt"
	"time"
)

// 通道就像是一个箱子, 不同的goroutine可以通过这个箱子与其他goroutine通信
// 通道是一种带有类型的值:
// ch := make(chan int)
// make默认创建的都是无缓冲通道, 如果用户在创建通道时, 向make函数提供了可选的第三个整数参数,
// 那么make函数将创建出一个带有给定大小的有缓冲通道:
// ch := make(chan int, 10)

// 无缓冲通道是同步的, 它就像是一个每次只能容纳一件物体的箱子. 当一个goroutine把一项信息放到
// 无缓冲通道之后, 除非有某个goroutine把这项信息取走, 否则其他goroutine将无法向这个通道放入如何信息
// 意味着: 如果一个goroutine想要向一个已经包含了某项信息的无缓冲通道再放入一项信息, 那么这个
// goroutine将被阻塞并进入休眠状态, 直到该通道变空为止.

// 同样: 如果一个goroutine尝试从一个没有包含如何信息的无缓冲通道中取出一项信息, 那么这个goroutine将会
// 被阻塞并进入休眠状态, 直到通道不再为空为止.

// 将信息放入通道:
// ch <- 1
// 从通道取出信息:
// i := <- ch

// 通道是可以定向的, 默认以双向形式运作
// 创建一个只能发送的字符串通道:
// ch := make(chan <- string)
// 只能接收的字符串通道:
// ch := make(<-chan string)

func printNumbers2(w chan bool) {
	for i := 0; i < 10; i++ {
		time.Sleep(1 * time.Microsecond)
		fmt.Printf("%d", i)
	}

	w <- true
}

func printLetters2(w chan bool) {
	for i := 'A'; i < 'A'+10; i++ {
		time.Sleep(1 * time.Microsecond)
		fmt.Printf("%c", i)
	}
	w <- true
}

// #1. 使用通道同步goroutine
func sync() {
	w1, w2 := make(chan bool), make(chan bool)

	go printNumbers2(w1)
	go printLetters2(w2)

	<-w1
	<-w2
}

func thrower(c chan int) {
	for i := 0; i < 5; i++ {
		c <- i
		fmt.Println("Threw >> ", i)
	}
}

func catcher(c chan int) {
	for i := 0; i < 5; i++ {
		num := <-c
		fmt.Println("Caught << ", num)
	}
}

// #2. 使用通道实现消息传递
func trans() {
	c := make(chan int)
	// c := make(chan int, 3)  // 创建有缓冲通道
	go thrower(c)
	go catcher(c)
	time.Sleep(1000000 * time.Microsecond)
}

// #3. 从多个通道中选择
func callerA(c chan string) {
	c <- "Hello world"

	// #3.1 关闭通道
	close(c)
}

func callerB(c chan string) {
	c <- "Hola Mundo"

	close(c)
}

func selectChan() {
	a, b := make(chan string), make(chan string)

	go callerA(a)
	go callerB(b)

	// for i := 0; i < 5; i++ {
	// 	time.Sleep(1 * time.Microsecond)
	// 	select {
	// 	case msg := <-a:
	// 		fmt.Printf("%s from A\n", msg)
	// 	case msg := <-b:
	// 		fmt.Printf("%s from B\n", msg)
	// 	default:
	// 		fmt.Println("Default")
	// 	}
	// }
	var msg string
	ok1, ok2 := true, true
	for ok1 || ok2 {
		// fmt.Println(ok1, ok2)

		select {
			case msg, ok1 = <-a:
				if ok1 {
					fmt.Printf("%s from A\n", msg)
				}
			case msg, ok2 = <-b:
				if ok2 {
					fmt.Printf("%s from B\n", msg)
				}
		}
	}
}

func main() {

	trans()

	sync()

	selectChan()

}
