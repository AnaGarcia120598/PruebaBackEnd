function primeFactors(n) {
    const factors = [];
    let divisor = 2;
    
    while (n > 2) {
      if (n % divisor === 0) {
        factors.push(divisor);
        n /= divisor;
      } else {
        divisor++;
      }
    }
    
    return factors;
  }
  
  // Pruebas TDD
  console.log(primeFactors(20)); // [2, 2, 5]
  console.log(primeFactors(330)); // [2, 3, 5, 11]
  