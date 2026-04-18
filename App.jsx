import React, { useState, useEffect, useMemo, useCallback, memo } from "react";

// Memoize the huge array creation to run only once
const makeHugeArray = () =>
  new Array(3000).fill(0).map((_, i) => ({
    id: i,
    text: "Item " + i + " " + new Array(100).fill("x").join(""),
  }));

function blockCPU(ms = 120) {
  const start = performance.now();
  while (performance.now() - start < ms) {
    // busy loop
  }
}

// Memoize individual list item to prevent unnecessary re-renders
const ListItem = memo(({ row, index }) => {
  const computed = useMemo(() => {
    return row.text.split("").reverse().join("");
  }, [row.text]);

  const handleClick = useCallback(() => {
    blockCPU(200);
    alert("Blocked UI thread for 200ms!");
  }, []);

  return (
    <div
      style={{
        padding: 8,
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <strong>{row.id}</strong> – {computed.substring(0, 60)}
      </div>
      <button onClick={handleClick}>Slow Btn</button>
    </div>
  );
});

ListItem.displayName = "ListItem";

function HeavyComponent() {
  // Memoize items to prevent recreation on every render
  const items = useMemo(() => makeHugeArray(), []);

  const [input, setInput] = useState("");

  // Memoize derived value calculation
  const derivedValue = useMemo(() => {
    return items.map((i) => Math.random()).join("-");
  }, [items]);

  // Move CPU blocking to useEffect with empty dependency to run only once
  useEffect(() => {
    blockCPU(150);
  }, []); // Empty dependency array - runs only on mount

  // Debounce input handler to avoid blocking on every keystroke
  const handleInputChange = useCallback((e) => {
    // Remove CPU blocking from input handler - it severely impacts UX
    setInput(e.target.value);
  }, []);

  return (
    <div style={{ border: "2px solid red", padding: 16, marginTop: 32 }}>
      <h2>HeavyComponent (Intentionally Slow)</h2>
      <p>
        This component simulates slow business logic, excessive rendering, and heavy object creation.
      </p>

      <input
        value={input}
        onChange={handleInputChange}
        placeholder="Type here (will lag!)"
      />

      <div style={{ height: 300, overflowY: "scroll", border: "1px solid #ccc", marginTop: 16 }}>
        {items.map((row, i) => (
          <ListItem key={row.id} row={row} index={i} />
        ))}
      </div>

      <p style={{ marginTop: 16 }}>
        Derived: <strong>{derivedValue.slice(0, 100)}</strong>
      </p>
    </div>
  );
}

function SlowStudentDashboard() {
  const [inputValue, setInputValue] = useState("");
  const [count, setCount] = useState(0);

  // Memoize expensive calculation - run only once on mount
  const heavyData = useMemo(() => {
    console.log("Running expensive calculation...");
    let result = 0;
    for (let i = 0; i < 500000000; i++) {
      result += Math.random();
    }
    return result;
  }, []);

  // Memoize input handler
  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  // Memoize count increment handler
  const handleCountClick = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Performance Audit Dashboard</h1>
      <div className="hero-section">
        <img
          src="https://via.placeholder.com/1200x600.png"
          alt="Large Hero Asset"
          loading="lazy"
        />
      </div>

      <div className="controls">
        <h2>Interactivity Test</h2>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type here to feel the lag..."
        />

        <button onClick={handleCountClick}>Re-render App (Count: {count})</button>
      </div>

      <div className="analytics">
        <HeavyAnalyticsChart
          config={{ theme: "dark", value: heavyData }}
          onUpdate={() => console.log("Chart updated")}
        />
      </div>
    </div>
  );
}

export default SlowStudentDashboard;