import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [comment, setComment] = useState('');
  const [rendered, setRendered] = useState('');
  const outputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setRendered(comment);
  };

  const loadExample = (payload) => {
    setComment(payload);
  };

  useEffect(() => {
    if (!outputRef.current) return;
    const scripts = Array.from(outputRef.current.querySelectorAll('script'));
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      if (script.src) {
        newScript.src = script.src;
      } else {
        newScript.textContent = script.textContent;
      }
      document.body.appendChild(newScript);
      setTimeout(() => document.body.removeChild(newScript), 0); // let it execute first
      script.remove();
    });
  }, [rendered]);

  return (
    <div className="App">
      <main className="App-main">
        <h1>XSS Vulnerability Demo</h1>
        <p>
          This page is intentionally vulnerable. Enter text with HTML or JavaScript and click Render.
        </p>

        <form className="demo-form" onSubmit={handleSubmit}>
          <label htmlFor="comment-input">Comment</label>
          <textarea
            id="comment-input"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Type HTML here, e.g. <img src=x onerror=alert('xss') />"
          />
          <button type="submit">Render</button>
        </form>

        <section className="output-section">
          <h2>Rendered Output</h2>
          <div
            className="output-box"
            ref={outputRef}
            dangerouslySetInnerHTML={{ __html: rendered || '<em>No content rendered yet.</em>' }}
          />
        </section>

        <aside className="hint-box">
          <p>Example payloads:</p>
          <ul className="payload-list">
            <li>
              <button type="button" className="payload-button" onClick={() => loadExample('<strong>This is injected text</strong>')}>
                <code>&lt;strong&gt;This is injected text&lt;/strong&gt;</code>
              </button>
            </li>
            <li>
              <button type="button" className="payload-button" onClick={() => loadExample('<img src="invalid.jpg" onerror="console.log(\'xss\')" />')}>
                <code>&lt;img src="invalid.jpg" onerror="console.log('xss')" /&gt;</code>
              </button>
            </li>
            <li>
              <button type="button" className="payload-button" onClick={() => loadExample('<svg/onload="console.log(\'xss\')"/>')}>
                <code>&lt;svg/onload="console.log('xss')"&gt;</code>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="payload-button"
                onClick={() => loadExample('<img src="invalid.jpg" onerror="document.body.style.background=\'gold\'" />')}
              >
                <code>&lt;img src="invalid.jpg" onerror="document.body.style.background='gold'" /&gt;</code>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="payload-button"
                onClick={() => loadExample('<script>document.body.style.background=\'gold\';</script>')}
              >
                <code>&lt;script&gt;document.body.style.background='gold';&lt;/script&gt;</code>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="payload-button"
                onClick={() => loadExample('<script>document.querySelector(\'h1\').textContent=\'Hacked!\'</script>')}
              >
                <code>&lt;script&gt;document.querySelector('h1').textContent='Hacked!'&lt;/script&gt;</code>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="payload-button"
                onClick={() => loadExample('<script>document.querySelector(\'p\').textContent=\'Hacked paragraph\'</script>')}
              >
                <code>&lt;script&gt;document.querySelector('p').textContent='Hacked paragraph'&lt;/script&gt;</code>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="payload-button"
                onClick={() => loadExample('<script>document.querySelector(\'h2\').textContent=\'Hacked heading\'</script>')}
              >
                <code>&lt;script&gt;document.querySelector('h2').textContent='Hacked heading'&lt;/script&gt;</code>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="payload-button"
                onClick={() => loadExample('<iframe srcdoc="<p>Injected iframe</p>"></iframe>')}
              >
                <code>&lt;iframe srcdoc="&lt;p&gt;Injected iframe&lt;/p&gt;"&gt;&lt;/iframe&gt;</code>
              </button>
            </li>
          </ul>
          <p>
            Note: this demo now executes injected <code>&lt;script&gt;</code> tags as well as event handlers,
            so both kinds of payloads can demonstrate XSS behavior by changing page elements and the browser title.
          </p>
        </aside>
      </main>
    </div>
  );
}

export default App;
