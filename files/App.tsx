import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface CalculatorState {
  num1: string;
  num2: string;
  operator: string;
  result: string;
}

const Calculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    num1: '',
    num2: '',
    operator: '',
    result: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleOperatorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setState((prevState) => ({ ...prevState, operator: value }));
  };

  const handleCalculate = () => {
    const { num1, num2, operator } = state;
    if (num1 && num2 && operator) {
      let result: number;
      switch (operator) {
        case '+':
          result = parseFloat(num1) + parseFloat(num2);
          break;
        case '-':
          result = parseFloat(num1) - parseFloat(num2);
          break;
        case '*':
          result = parseFloat(num1) * parseFloat(num2);
          break;
        case '/':
          result = parseFloat(num1) / parseFloat(num2);
          break;
        default:
          result = 0;
      }
      setState((prevState) => ({ ...prevState, result: result.toString() }));
    }
  };

  const handleClear = () => {
    setState({
      num1: '',
      num2: '',
      operator: '',
      result: '',
    });
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Calculator</h2>
      <div className="flex flex-col mb-4">
        <label className="text-lg font-medium mb-2">Number 1:</label>
        <input
          type="number"
          name="num1"
          value={state.num1}
          onChange={handleInputChange}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-lg font-medium mb-2">Operator:</label>
        <select
          value={state.operator}
          onChange={handleOperatorChange}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select Operator</option>
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">*</option>
          <option value="/">/</option>
        </select>
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-lg font-medium mb-2">Number 2:</label>
        <input
          type="number"
          name="num2"
          value={state.num2}
          onChange={handleInputChange}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-lg font-medium mb-2">Result:</label>
        <input
          type="text"
          value={state.result}
          readOnly
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleCalculate}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Calculate
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Calculator;
