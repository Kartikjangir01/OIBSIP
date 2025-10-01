(function(){
  const screen = document.getElementById('screen');
  let current = '0';
  let previous = null;
  let operator = null;
  let justCalculated = false;

  function updateScreen(){
    screen.textContent = current;
  }

  function inputNumber(d){
    if(justCalculated){
      // start new number after result
      current = d === '.' ? '0.' : d;
      justCalculated = false;
      return;
    }
    if(current === '0' && d !== '.') current = d;
    else current = current + d;
  }

  function inputDecimal(){
    if(justCalculated){
      current = '0.';
      justCalculated = false;
      return;
    }
    if(!current.includes('.')) current += '.';
  }

  function clearAll(){
    current = '0';
    previous = null;
    operator = null;
    justCalculated = false;
  }

  function backspace(){
    if(justCalculated){
      current = '0';
      justCalculated = false;
      return;
    }
    if(current.length <= 1) current = '0';
    else current = current.slice(0, -1);
  }

  function setOperator(op){
    if(operator && previous !== null && !justCalculated){
      // chain calculations
      previous = compute(previous, current, operator);
      current = String(previous);
    } else {
      previous = parseFloat(current);
    }
    operator = op;
    current = '0';
    justCalculated = false;
  }

  function percent(){
    current = String(parseFloat(current) / 100);
  }

  function compute(a, b, op){
    const x = parseFloat(a);
    const y = parseFloat(b);
    if(isNaN(x) || isNaN(y)) return y;
    switch(op){
      case 'add': return +(x + y).toPrecision(12);
      case 'subtract': return +(x - y).toPrecision(12);
      case 'multiply': return +(x * y).toPrecision(12);
      case 'divide': return y === 0 ? 'Error' : +(x / y).toPrecision(12);
      default: return y;
    }
  }

  function equals(){
    if(operator === null || previous === null) return;
    const result = compute(previous, current, operator);
    current = String(result);
    previous = null;
    operator = null;
    justCalculated = true;
  }

  // unify button clicks
  document.querySelectorAll('.key').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const num = btn.getAttribute('data-num');
      const action = btn.getAttribute('data-action');

      if(num !== null){
        inputNumber(num);
        updateScreen();
        return;
      }

      switch(action){
        case 'decimal': inputDecimal(); break;
        case 'clear': clearAll(); break;
        case 'back': backspace(); break;
        case 'percent': percent(); break;
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
          setOperator(action); break;
        case 'equals': equals(); break;
      }
      updateScreen();
    });
  });

  // keyboard support
  window.addEventListener('keydown', e=>{
    const key = e.key;
    if(/[0-9]/.test(key)){ inputNumber(key); updateScreen(); }
    else if(key === '.') { inputDecimal(); updateScreen(); }
    else if(key === 'Backspace'){ backspace(); updateScreen(); }
    else if(key === 'Escape'){ clearAll(); updateScreen(); }
    else if(key === '+'|| key === '='){ setOperator('add'); updateScreen(); }
    else if(key === '-'){ setOperator('subtract'); updateScreen(); }
    else if(key === '*' ){ setOperator('multiply'); updateScreen(); }
    else if(key === '/' ){ setOperator('divide'); updateScreen(); }
    else if(key === 'Enter'){ equals(); updateScreen(); }
  });

  // init
  updateScreen();
})();