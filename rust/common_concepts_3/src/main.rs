fn main() {
    let mut x = 5;

    println!("the x is {x}");

    x = 6;

    println!("the x is {x}");

    let mut x = x + 1;

    {
        x = x * 2;
        
        println!("the inner x is {x}")
    }
    println!("the x is {x}")

    
}


