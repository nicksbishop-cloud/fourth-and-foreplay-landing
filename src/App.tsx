import { useState, type FormEvent } from 'react';
import { Heart, Trophy, Zap } from 'lucide-react';

function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>(
    'idle'
  );

  async function join(e: FormEvent) {
    e.preventDefault();
    if (status === 'saving') return;
    const normalizedEmail = email.trim();
    if (normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStatus('error');
      return;
    }
    setStatus('saving');
    try {
      const response = await fetch('/api/early-access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: normalizedEmail }), signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok || result.joined !== true) throw new Error('Signup unavailable');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <main>
      <nav aria-label="Main navigation">
        <div className="brand-lockup">
          <img width="1254" height="1254" src="./resources/logo.png" alt="Fourth & Foreplay" />
          <div className="wordmark">FOURTH <span>&amp;</span> FOREPLAY</div>
        </div>
        <a href="#early-access">EARLY ACCESS</a>
      </nav>
      <section className="hero">
        <img width="1254" height="1254" className="hero-logo" src="./resources/logo.png" alt="Fourth & Foreplay Fantasy League logo" />
        <div className="eyebrow">FANTASY FOOTBALL FOR COUPLES</div>
        <h1>
          Fantasy football
          <br />
          <em>just got personal.</em>
        </h1>
        <p className="lead">
          Compete against your partner. Track the matchup. Put something worth
          winning on the line.
        </p>
        <a className="cta" href="#early-access">
          JOIN EARLY ACCESS <span>→</span>
        </a>

      </section>

      <section className="product-showcase">
        <div className="section-kicker">SEE IT IN ACTION</div>
        <h2>Built for <em>game day.</em></h2>
        <p className="showcase-lead">Your matchup, your lineup, and what’s on the line — all in one place.</p>
        <div className="screenshots" role="region" aria-label="App screenshots" tabIndex={0}>
          <figure><img loading="lazy" width="709" height="1536" src="./resources/matchup.jpeg" alt="Fourth & Foreplay matchup screen" /><figcaption>LIVE MATCHUP</figcaption></figure>
          <figure><img loading="lazy" width="709" height="1536" src="./resources/roster.jpeg" alt="Fourth & Foreplay roster screen" /><figcaption>YOUR LINEUP</figcaption></figure>
          <figure><img loading="lazy" width="1125" height="2436" src="./resources/on-the-line.png" alt="Fourth & Foreplay On the Line screen" /><figcaption>WHAT’S ON THE LINE</figcaption></figure>
        </div>
      </section>

      <section className="commercial">
        <div className="section-kicker">MEET FOURTH &amp; FOREPLAY</div>
        <h2>Same couch. <em>Different teams.</em></h2>
        <div className="video-frame">
          <video aria-label="Fourth & Foreplay commercial" width="512" height="910" controls playsInline preload="none" poster="./resources/logo.png">
            <source src="./resources/commercial.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      <section className="features">
        <div className="section-kicker">MORE THAN BRAGGING RIGHTS</div>
        <h2>
          Put something <em>on the line.</em>
        </h2>
        <div className="cards">
          <article>
            <Trophy />
            <small aria-hidden="true">01</small>
            <h3>Winner gets the reward.</h3>
            <p>Choose something that makes Sunday victory feel even better.</p>
          </article>
          <article>
            <Zap />
            <small aria-hidden="true">02</small>
            <h3>Loser gets the punishment.</h3>
            <p>
              A little extra motivation for every lineup decision and every
              point.
            </p>
          </article>
          <article>
            <Heart />
            <small aria-hidden="true">03</small>
            <h3>Or make up your own.</h3>
            <p>Your relationship. Your rivalry. Your stakes.</p>
          </article>
        </div>
      </section>

      <section className="how">
        <div>
          <div className="section-kicker">THE MATCHUP</div>
          <h2>
            Every point
            <br />
            means <em>more.</em>
          </h2>
        </div>
        <div className="steps">
          <p>
            <b>01</b>
            <span>
              <strong>Set your lineup</strong>Play fantasy football the way you
              already love to play.
            </span>
          </p>
          <p>
            <b>02</b>
            <span>
              <strong>Watch it unfold</strong>Follow projected points and your
              chance to win.
            </span>
          </p>
          <p>
            <b>03</b>
            <span>
              <strong>Settle the stakes</strong>The final whistle means somebody
              gets rewarded.
            </span>
          </p>
        </div>
      </section>

      <section id="early-access" className="signup" aria-labelledby="signup-title">
        <div className="eyebrow">BE FIRST IN THE LEAGUE</div>
        <h2 id="signup-title">Get early access.</h2>
        <p>
          Fourth & Foreplay is coming. Join the list for launch updates and
          early access.
        </p>
        {status === 'success' ? (
          <div className="success" role="status">YOU'RE ON THE LIST. 🏈❤️</div>
        ) : (
          <form onSubmit={join} aria-busy={status === 'saving'}>
            <input
              aria-label="Email address"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              name="email"
              disabled={status === 'saving'}
              aria-describedby="signup-note"
              placeholder="YOUR EMAIL ADDRESS"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setStatus('idle');
              }}
            />
            <button type="submit" disabled={status === 'saving'}>
              {status === 'saving' ? 'JOINING…' : 'JOIN EARLY ACCESS →'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <div className="error" role="alert">We couldn’t add your email. Please try again.</div>
        )}
        <small id="signup-note">We use your email for early access and launch updates. No spam.</small>
      </section>
      <footer>
        <div className="footer-brand">
          <img width="1254" height="1254" src="./resources/logo.png" alt="Fourth & Foreplay" />
          <div className="wordmark">FOURTH <span>&amp;</span> FOREPLAY</div>
        </div>
        <p>Fantasy football just got personal.</p>
        <small>© 2026 Fourth & Foreplay</small>
      </footer>
    </main>
  );
}
export default App;

