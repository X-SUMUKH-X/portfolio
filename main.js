// Theme Toggle Control
function setTheme(theme) {
    const html = document.documentElement;
    
    // Toggle class
    if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        html.className = systemDark ? 'dark' : 'light';
        localStorage.removeItem('theme');
    } else {
        html.className = theme;
        localStorage.setItem('theme', theme);
    }
    
    // Set active button styles
    document.querySelectorAll('.theme-btn').forEach(btn => {
        const btnTheme = btn.getAttribute('data-theme');
        if (btnTheme === theme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function setupThemeToggle() {
    // Add click listeners to buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            setTheme(theme);
        });
    });

    // Auto-detect system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.className = e.matches ? 'dark' : 'light';
        }
    });
}

// Collapsible Experience Sections
function setupCollapsibleExp() {
    document.querySelectorAll('.exp-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const li = btn.closest('li');
            const body = li.querySelector('.exp-body');
            const chevron = btn.querySelector('.exp-chevron');
            
            body.classList.toggle('open');
            chevron.classList.toggle('rotated');
        });
    });
}

// Slack Workspace Simulator Data & Interaction
const slackChannels = {
    'inside-swiggy': [
        { user: 'Sumukh Singh', time: '10:04 AM', text: 'Hey guys, dropping the unreleased Instamart brand film here first. Do NOT share outside this channel. 🤫' },
        { user: 'Siddharth (Growth)', time: '10:12 AM', text: 'This is insane. Splicing it directly into #inside-swiggy is exactly how we kill those loose WhatsApp threads.' },
        { user: 'Anjali (Brand Ops)', time: '10:15 AM', text: 'Agreed. If you\'re not checking Slack, you\'re literally out of the loop on the cool stuff. Love this launch.' },
        { user: 'Sumukh Singh', time: '10:18 AM', text: 'Exactly the point. FOMO works better than policy updates. Swiggy lives on Slack now!' }
    ],
    'swiggy-scoreboard': [
        { user: 'Swiggy Bot', time: '09:00 AM', text: '📈 DAILY MILESTONE REACHED: Instamart orders crossed 1.2M in a single day! 🚀' },
        { user: 'Sumukh Singh', time: '09:05 AM', text: 'Huge win for Gurgaon team. Let\'s shoutout @Rohit (Gurgaon Ops) for resolving the driver cluster issues in #need-help yesterday.' },
        { user: 'Rohit (Ops)', time: '09:12 AM', text: 'Thanks Sumukh! Just dropped the learnings thread in #gurgaon-ops. Standup updates are all in Slack now.' }
    ],
    'chai-biscuits': [
        { user: 'Saurabh (Designer)', time: '03:15 PM', text: 'My submission for this Friday\'s theme: "When someone says - let\'s run a quick sync on WhatsApp" 💀 [Meme Image: Distracted boyfriend looking at Slack]' },
        { user: 'Sumukh Singh', time: '03:22 PM', text: 'Hahaha this is hitting 100% emoji votes. Remember, winner gets 1k Instamart/Dineout credit!' },
        { user: 'Meghna (HR)', time: '03:30 PM', text: 'Voting with :biryani: emoji. Let\'s keep it going!' }
    ],
    'need-help': [
        { user: 'Kunal (Tech Support)', time: '11:04 AM', text: 'Anyone else having issues loading the merchant portal dashboard metrics?' },
        { user: 'Sumukh Singh', time: '11:06 AM', text: 'Pinged the API team. They\'re hotfixing it. Kunal, check the #tech-alerts channel, update pinned there.' },
        { user: 'Kunal (Tech Support)', time: '11:15 AM', text: 'Got it, resolved. Slack is so much faster than DM loops.' }
    ]
};

function setupSlackSimulator() {
    const channelItems = document.querySelectorAll('.slack-channel-item');
    const messagesContainer = document.getElementById('slackMessages');
    const headerTitle = document.getElementById('slackHeaderTitle');
    
    channelItems.forEach(item => {
        item.addEventListener('click', () => {
            const channel = item.getAttribute('data-channel');
            
            // Set active class
            channelItems.forEach(c => c.classList.remove('active'));
            item.classList.add('active');
            
            // Set Header
            headerTitle.textContent = `#${channel}`;
            
            // Render Messages
            messagesContainer.innerHTML = '';
            if (slackChannels[channel]) {
                slackChannels[channel].forEach(msg => {
                    const initials = msg.user.split(' ').map(n => n[0]).join('');
                    const isSumukh = msg.user.startsWith('Sumukh');
                    
                    const msgEl = document.createElement('div');
                    msgEl.className = 'slack-msg';
                    msgEl.innerHTML = `
                        <div class="slack-avatar" style="${isSumukh ? 'background-color: var(--accent-color); color: white;' : ''}">${initials}</div>
                        <div class="slack-msg-content">
                            <div class="slack-msg-meta">
                                <span class="slack-user">${msg.user}</span>
                                <span class="slack-time">${msg.time}</span>
                            </div>
                            <span class="slack-text">${msg.text}</span>
                        </div>
                    `;
                    messagesContainer.appendChild(msgEl);
                });
                
                // Scroll to bottom
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        });
    });
}

// Blinkit Metrics Counter Animation
function animateCounter(el, target) {
    let current = 0;
    const duration = 1200; // ms
    const stepTime = 15; // ms
    const increment = target / (duration / stepTime);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format logic
        if (target >= 1000) {
            el.textContent = `${(current / 1000).toFixed(1)}k+`;
        } else if (Number.isInteger(target)) {
            el.textContent = Math.round(current);
        } else {
            el.textContent = `${current.toFixed(1)}%`;
        }
    }, stepTime);
}

function setupMetricsAnimator() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseFloat(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.animate-stat').forEach(el => {
        observer.observe(el);
    });
}

// Notion Drawer Controls
const essayTemplates = {
    'creative-strategy': {
        title: 'Creative Strategy Framework',
        html: `
            <h3>how i actually think about creative strategy (not “i helped with content”)</h3>
            <p>i didn’t “help with content.”</p>
            <p>i thought like a creative strategist and executed like an operator.</p>
            <p>most days started the same way: what’s the story we’re telling today, and where does it live — reel, meme, banner, script, or a DM that doesn’t sound like a DM.</p>
            <p>for fokus, it wasn’t “let’s do a banner.” it was: how do we make a sugar-free drink look fun without shouting “healthy” in people’s faces. that turned into a bright, flavour-first offline banner idea that looked like something you’d actually stop and notice, not a pharma ad.<br><a href="https://drive.google.com/file/d/1BK72PaPQFPVzJv0zJUiF2jz5GnF3cTJQ/view" target="_blank" style="color: var(--accent-color); text-decoration: underline;">rough design created by me :)</a></p>
            <p>for social, i sat in the middle of ideas, trends, and brand reality.</p>
            <p>i pitched things like the “stack fokus challenge,” delivery reels, pov shots tracing a product from warehouse to doorstep, and subtle product placements that feel like scenes, not ads. every idea had to answer one question: would i share this with a friend or just scroll past it. <a href="https://www.instagram.com/p/DJ6faF8htmZ/?hl=en" target="_blank" style="color: var(--accent-color); text-decoration: underline;">link :)</a></p>
            <p>i spent a lot of time inside other people’s content too — studying what competitors were doing, what was overdone, what still had white space. not to copy, but to know exactly what <em>not</em> to make.</p>
            <p>meme marketing was where it got really interesting.</p>
            <p>for shows like “very parivarik” and “lafangey,” i wasn’t just saying “we’ll do memes.” i was breaking down specific moments with share potential — family group admin drama, awkward dinner conversations, city chaos, friendship banter — and positioning them as daily internet moments, not “campaign assets.”</p>
            <p>same with performance brands like avvatar nutrition: gym fails, protein shake mishaps, “new PR” ego — all the stuff fitness people actually joke about with their friends. that’s the raw material. my job was to connect it to the brand without killing the joke.</p>
            <p>the outreach itself was part of the creative strategy.</p>
            <p>every email or whatsapp msg had a clear arc:</p>
            <ul style="margin-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; color: var(--text-muted);">
                <li>open with a real compliment (trailer watched, spot seen, specific moment referenced)</li>
                <li>show proof of work (<a href="https://app.notion.com/p/how-i-actually-think-about-creative-strategy-not-i-helped-with-content-3105d09c167680b3b21ccb12b7ab7fb1?source=copy_link" target="_blank" style="color: var(--accent-color); text-decoration: underline;">nykaa’s “wali shaadi” hitting 58m+ views &rarr;</a>)</li>
                <li>then bridge into the kind of content we could build around their world — not generic “we’ll increase engagement,” but “here’s how your show becomes the timeline’s inside joke for a week.”</li>
            </ul>
            <p>no templates. no “hope this email finds you well” energy. each line worked to answer: why you, why now, why us.</p>
            <p>internally, i helped turn vague directions into usable creative.</p>
            <p>tightening campaign names, sharpening hooks, giving notes on edits, and making sure every piece answered three things:</p>
            <ul style="margin-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; color: var(--text-muted);">
                <li>what’s the insight</li>
                <li>what’s the emotion</li>
                <li>what’s the share line</li>
            </ul>
            <p>that’s the part nobody sees in a work summary, but it’s the only reason any of the visible stuff works.</p>
            <p>i wasn’t just shipping posts.</p>
            <p>i was:</p>
            <ul style="margin-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; color: var(--text-muted);">
                <li>finding the moments worth amplifying</li>
                <li>turning them into formats the internet actually respects</li>
                <li>and backing it all with outreach and communication that didn’t feel like it was written by a robot.</li>
            </ul>
            <p style="margin-top: 24px; font-family: var(--font-mono); font-size: 13px; font-weight: 500;">sumukh :)</p>
        `
    },
    'swiggy-hq': {
        title: 'Swiggy HQ Campaign Strategy',
        html: `
            <h3>slack is the new swiggy HQ. whatsapp is for family groups.</h3>
            
            <div style="border-left: 2px solid var(--accent-color); padding-left: 12px; margin-bottom: 24px; color: var(--text-muted);">
                <strong>1/ “slack‑first swiggy” – campaign strategy</strong><br>
                <strong>campaign name:</strong> slack‑first swiggy<br>
                <strong>one‑liner:</strong> all the real swiggy stuff now happens on slack. miss slack, miss out.
            </div>

            <p><strong>core idea (behaviour shift, not policy):</strong></p>
            <p>right now, every team at swiggy has 17 whatsapp groups, 4 side DMs, and 0 single source of truth. work, memes, escalations, dashboards – everything is scattered. slack‑first swiggy turns slack into the <em>only</em> place where the company truly exists: decisions, inside jokes, new launches, leader hot‑takes, city wins. if you care about what’s actually happening at swiggy – you open slack. whatsapp becomes what it was always meant for: family, friends, and alumni groups.</p>

            <p><strong>fomo mechanic – what you lose if you ignore slack:</strong></p>
            <p>if you’re not on slack daily, you don’t see:</p>
            <ul style="margin-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; color: var(--text-muted);">
                <li>early drops: instamart experiments, dineout pilots, new brand films before they go public.</li>
                <li>“no recording” AMAs with leaders: 20‑minute fire sessions where nothing is emailed and nothing is uploaded later.</li>
                <li>live scoreboards: real‑time order milestones, nps spikes, city shoutouts.</li>
                <li>rewards + in‑jokes: meme fridays, surprise vouchers, inside memes that never make it to whatsapp.</li>
            </ul>
            <p>the rule is simple: <strong>if it didn’t happen on slack, it didn’t happen at swiggy.</strong></p>

            <p><strong>behaviour goal:</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; color: var(--text-muted);">
                <li>by the end of the campaign, slack becomes the default reflex.</li>
                <li>80% of employees are daily active on slack.</li>
                <li>90% of core work conversations (ops, tech, brand, support) happen in slack channels, not in whatsapp threads.</li>
            </ul>

            <hr style="border: 0; border-top: 1px solid var(--border); margin: 24px 0;">

            <p><strong>2/ behaviour design – making slack the only place that matters</strong></p>
            <p><strong>a/ core rituals & mechanics</strong></p>

            <p><strong>1. #inside‑swiggy – the no‑screenshot club</strong></p>
            <p>a single, always‑on “insider” channel where the most exciting, messy, unpolished stuff lives. product mocks, unreleased ad films, crazy customer stories, WIP dashboards, viral tweets about swiggy – all drop here first. nothing from here is mailed or mirrored. this channel gets treated like a private green room: you’re either inside or you hear about it second‑hand.</p>
            <p>→ result: people open slack “just to check what’s cooking”, the same way they refresh instagram.</p>

            <p><strong>2. slack‑only standups (10 minutes, one home)</strong></p>
            <p>every pod/team picks a fixed slack channel for updates (#city‑gurgaon‑ops, #instamart‑growth, etc.). daily ritual:</p>
            <ul style="margin-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; color: var(--text-muted);">
                <li>yesterday: what moved</li>
                <li>today: what you’re shipping</li>
                <li>blocked on: 1 line</li>
            </ul>
            <p>no parallel “quick update?” whatsapp messages. if someone drops it on whatsapp, leads nudge: “put this in slack so the whole team can see.”<br>
            → result: speed without chaos. everyone learns: if you weren’t on the standup channel, you’re out of the loop.</p>

            <p><strong>3. #swiggy‑scoreboard – public wins, public status</strong></p>
            <p>a live channel showing:</p>
            <ul style="margin-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; color: var(--text-muted);">
                <li>real‑time milestones (orders, nps, new city launches).</li>
                <li>shoutouts to people who unblocked issues in #need‑help.</li>
                <li>weekly leaderboard: most helpful channels + “slack mvp” humans (quality replies, not spam).</li>
            </ul>
            <p>only slack sees this. no emailer, no whatsapp forward.<br>
            → result: people want to be seen here. status = show up on slack.</p>

            <p><strong>4. #chai‑biscuits – meme fridays</strong></p>
            <p>fridays run on themes like “instamart at 2am”, “that one stakeholder”, “city ops life”. people drop memes, screenshots, reels – all inside this channel. team votes with a custom emoji (:mirchi:, :biryani:). winner gets instamart or dineout credit + a mini feature in #inside‑swiggy.</p>
            <p>→ result: you don’t kill whatsapp’s humour, you relocate it into slack where more people actually see it.</p>

            <p><strong>5. #need‑help – the fastest route to answers</strong></p>
            <p>one simple, obvious channel: “stuck? ask here.” backed by a small squad of “slack champions” from HR, IT, ops with a &lt;10‑minute response promise during work hours. any DM or whatsapp ping gets this default reply: “drop it in #need‑help so it doesn’t get lost.”</p>
            <p>→ result: employees learn that slack isn’t just “another tool”, it’s the fastest way to move things.</p>

            <p><strong>b/ how each element kills whatsapp dependency</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; color: var(--text-muted);">
                <li>#inside‑swiggy → no more forwarding screenshots of “did you see this?” in random groups. the source is always slack.</li>
                <li>slack standups → team updates stop living in scattered whatsapp chats; leaders refuse to acknowledge updates outside slack.</li>
                <li>#swiggy‑scoreboard → big news is no longer sprayed across email + whatsapp; it has one canonical home.</li>
                <li>#chai‑biscuits → light‑weight banter and memes leave informal groups and move where everyone can see + join in.</li>
                <li>#need‑help → instead of DMing 5 people on whatsapp, folks learn: “ask once on slack, get the right answer, fast.”</li>
            </ul>
            <p>over 1–2 weeks, the brain re‑wires: work = slack. whatsapp = noise.</p>

            <hr style="border: 0; border-top: 1px solid var(--border); margin: 24px 0;">

            <p><strong>3/ creative hook – hero launch asset</strong></p>
            <p>this section is the hero asset: a poster + a series of slack‑native launch assets (announcement, poll, meme thread) + a short “from chaos to HQ” video hook.</p>

            <p><strong>3.0 hero visual – poster</strong></p>
            <div style="margin: 16px 0; text-align: center;">
                <img src="/swiggy-poster.jpg" alt="Swiggy Campaign Poster Feb 24 2026" style="width: 100%; max-width: 440px; border-radius: 8px; border: 1px solid var(--border); box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
                <p style="font-size: 11px; color: var(--text-muted); margin-top: 8px; font-family: var(--font-mono);">Swiggy Campaign Poster Feb 24 2026</p>
            </div>
            <p>this is the anchor visual for the campaign: a monkey at a desk, locked into a slack screen, surrounded by caffeine and chaos. it looks like every swiggy workday, just turned into a meme.</p>
            <ul style="margin-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; color: var(--text-muted);">
                <li>the slack screen shows <code>#launch-war-room</code>, <code>#wins</code>, <code>#memes</code> – the three real reasons people open slack: ship, flex, laugh.</li>
                <li>the monkey is literally “us”: slightly unhinged, highly online, figuring things out as we go.</li>
                <li>the orange plush + warm gradient background nod to swiggy’s palette and energy – playful, fast, a little chaotic.</li>
                <li>the line at the bottom – <strong>“login. collab. cook up chaos. HQ is where you make it.”</strong> – quietly flips the narrative: HQ is not a physical office or a whatsapp group. HQ is wherever the real work, jokes and launches live. for swiggy, that’s slack now.</li>
            </ul>

            <p><strong>format: slack‑native launch pack (for #general)</strong></p>
            <p>this fits a busy, on‑the‑go workforce better than a long email. it lives where we want them to live: inside slack.</p>

            <p><strong>3.1 launch message – #general</strong></p>
            <div style="background-color: var(--card-bg); border: 1px solid var(--border); padding: 14px; border-radius: 6px; font-family: var(--font-sans); font-size: 13px; color: var(--text); margin-bottom: 16px;">
                <p>hey team 👋</p>
                <p>we’re shipping something internal but kind of massive.</p>
                <p>starting this week, <strong>swiggy officially becomes slack‑first.</strong></p>
                <p>not in a “new policy pls read” way. in a “if you’re not on slack, you’re literally missing half the company” way.</p>
                <p>here’s what’s changing:</p>
                <ul style="margin-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px;">
                    <li>all team standups + key updates → in their slack channels only</li>
                    <li>early product peeks + campaign WIPs → only in #inside‑swiggy</li>
                    <li>live wins + shoutouts → only in #swiggy‑scoreboard</li>
                    <li>“who can help with this?” → only in #need‑help</li>
                </ul>
                <p>whatsapp is for cousins and college groups.</p>
                <p><strong>swiggy now lives on slack.</strong></p>
                <p>👉 step 1 (right now): join these channels</p>
                <ul style="margin-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px;">
                    <li>#inside‑swiggy</li>
                    <li>#swiggy‑scoreboard</li>
                    <li>#need‑help</li>
                    <li>your team standup channel (#city‑___‑ops, #instamart‑___, #brand‑___, etc.)</li>
                </ul>
                <p>give this 7 days. if you still think whatsapp is better for work after that, we’ll talk. 😉</p>
            </div>

            <p><strong>3.2 follow‑up poll (snackable)</strong></p>
            <div style="background-color: var(--card-bg); border: 1px solid var(--border); padding: 14px; border-radius: 6px; font-family: var(--font-sans); font-size: 13px; color: var(--text); margin-bottom: 16px;">
                <p>be honest for 5 seconds 👀</p>
                <p>where does your thumb still go <em>first</em> when it’s “work stuff”?</p>
                <p>🔘 whatsapp</p>
                <p>🔘 half whatsapp, half slack</p>
                <p>🔘 fully slack‑first already</p>
                <p style="font-size: 12px; color: var(--text-muted);">step 1 is knowing the habit.<br>step 2 is breaking it over the next 7 days.</p>
            </div>

            <p><strong>3.3 meme‑style teaser</strong></p>
            <div style="background-color: var(--card-bg); border: 1px solid var(--border); padding: 14px; border-radius: 6px; font-family: var(--font-sans); font-size: 13px; color: var(--text); margin-bottom: 16px;">
                <p>him: “can you send updates here also? the whatsapp group is more active.”</p>
                <p>swiggy 2025: 🤔</p>
                <p><strong>if it’s not on slack, it didn’t happen.</strong></p>
                <p>drop your best “whatsapp vs slack” memes in #chai‑biscuits today.</p>
                <p>best one gets an instamart voucher + a feature in #inside‑swiggy.</p>
            </div>

            <p><strong>3.4 visual direction (for posters/banners inside slack)</strong></p>
            <p>the poster becomes the base style: loud swiggy orange, dark backgrounds, big lowercase copy. from that, we spin quick assets — slack banners, channel cover images, meme templates, sticker packs — all using the same look so “slack = swiggy HQ” feels like one campaign, not random posts.</p>

            <p><strong>3.5 from chaos to HQ (30–40s script)</strong></p>
            <p>format: raw, vertical, feels like something a manager shot between meetings.</p>
            <p>opening shot: close‑up of a phone buzzing. 14 unread whatsapp groups: “swiggy ops”, “swiggy work (final)”, “swiggy work (final-final)”, “swiggy night shift”, “swiggy random”.</p>
            <p>VO (calm, matter‑of‑fact):<br>
            “this is not speed. this is chaos.”</p>
            <p>cut to: slack on a laptop and phone. neat sidebar: #inside-swiggy, #swiggy-scoreboard, #need-help, #chai-biscuits.</p>
            <p>VO:<br>
            “this is HQ.”</p>
            <p>quick cuts, fast but clear:<br>
            – a meme dropping in #chai-biscuits, reactions exploding<br>
            – a CXO replying in an AMA thread in #inside-swiggy<br>
            – #swiggy-scoreboard hitting a new orders milestone<br>
            – someone asking for help in #need-help and getting a reply in seconds</p>
            <p>supers on screen through the montage:<br>
            “one place for wins.”<br>
            “one place for answers.”<br>
            “one place for jokes.”</p>
            <p>VO:<br>
            “if it’s important for swiggy, it lives here now.”</p>
            <p>final shot: the poster full‑frame. the monkey, the slack screen, the line at the bottom.</p>
            <p>end super:<br>
            “slack is the new swiggy HQ. whatsapp is for family groups.”</p>

            <hr style="border: 0; border-top: 1px solid var(--border); margin: 24px 0;">

            <p><strong>4/ 7‑day rollout playbook</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; color: var(--text-muted);">
                <li><strong>day 1 – flip the switch:</strong> drop the hero announcement in #general, auto‑add everyone to #inside‑swiggy, #swiggy‑scoreboard, #need‑help. pin a tiny “how we use slack” note. leads start redirecting “pls send here also” requests away from whatsapp.</li>
                <li><strong>day 2 – first “inside” drop:</strong> product/brand shares something genuinely exciting only in #inside‑swiggy (new feature preview, ad film WIP). explicitly mention “not going on email / whatsapp.” everyone sees what “missing out” actually looks like.</li>
                <li><strong>day 3 – standups move home:</strong> all teams run standups only in slack channels. a simple template is pinned. any whatsapp standup gets a friendly “pls move this to slack so everyone sees it.” people learn where to look.</li>
                <li><strong>day 4 – scoreboard & shoutouts:</strong> launch #swiggy‑scoreboard with live metrics and 3–5 shoutouts, tagging people who answered in #need‑help. make it feel like an internal “instagram explore” for wins.</li>
                <li><strong>day 5 – meme friday:</strong> run the first themed meme friday in #chai‑biscuits. talk about the prize upfront. repost the winning meme in #inside‑swiggy to reinforce that this is the “culture” channel now.</li>
                <li><strong>day 6 – leadership AMAs:</strong> host 2–3 short AMAs in slack with CXOs / city heads. clearly say “no recording, no email recap. only thread summary here.” this makes slack feel like a live room, not an archive.</li>
                <li><strong>day 7 – recap & receipts:</strong> share a before/after snapshot in #general: slack daily actives last week vs this week, # of active channels, 2–3 screenshots of “this used to be whatsapp, now it’s slack.” shout out “slack champions” by name to cement the new identity.</li>
            </ul>

            <hr style="border: 0; border-top: 1px solid var(--border); margin: 24px 0;">

            <p><strong>5/ strategy & tools – the “why” + genAI</strong></p>
            <p><strong>the why – why this will work for busy, whatsapp‑native employees:</strong></p>
            <p>this campaign doesn’t ask people to “please use slack more.” it rewires incentives. for a busy, on‑ground swiggy workforce, attention goes wherever the fastest answers, juiciest updates, and highest status live. so we put all of that <strong>only</strong> on slack. instead of fighting years of whatsapp habit with a policy, we weaponise fomo and identity: insiders hang out here; outsiders hear about it later. rituals like meme fridays, no‑recording AMAs, and live scoreboards make slack less like a corporate tool and more like the company’s group chat – the place where swiggy actually breathes.</p>
            <p><strong>the how – genAI stack that makes this shippable fast:</strong></p>
            <p>tools like ChatGPT / Dia handle all the slack copy in this plan - announcements, AMA prompts, scoreboard blurbs, redirect messages - so comms never has to stare at a blank page. for the visuals, i used <strong>DALL·E</strong> to generate the hero poster (monkey at the desk, slack screen, warm swiggy‑coded palette), iterating on prompts written and refined with ChatGPT to get the exact vibe. beyond that, visual tools like Midjourney or Canva / Canva Magic Studio can take a rough idea like “whatsapp vs slack” and spin out on‑brand stickers, banners, and meme templates in minutes instead of days. once the core assets are ready, AI translation features can auto‑localise them for different cities and languages without spinning up separate content teams. net effect: genAI compresses time by turning “we should run a slack‑first campaign” from a 3‑week project with 7 approvals into a 1–2 day sprint — ideas → copy → design → localisation, all shipped by a tiny team on a tight feedback loop.</p>

            <p style="margin-top: 24px; font-family: var(--font-mono); font-size: 13px; font-weight: 500;">concept, copy, poster & genAI workflow: sumukh :)</p>
        `
    }
};

function setupNotionDrawer() {
    const backdrop = document.getElementById('drawerBackdrop');
    const drawer = document.getElementById('notionDrawer');
    const closeBtn = document.getElementById('closeDrawerBtn');
    const drawerContentBody = document.getElementById('drawerContentBody');
    const drawerHeaderTitle = document.getElementById('drawerHeaderTitle');
    const readBtns = document.querySelectorAll('.read-drawer-btn');
    
    if (backdrop && drawer && closeBtn && drawerContentBody && drawerHeaderTitle) {
        readBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const essayId = btn.getAttribute('data-essay');
                const template = essayTemplates[essayId];
                if (template) {
                    drawerHeaderTitle.textContent = template.title;
                    drawerContentBody.innerHTML = template.html;
                    backdrop.classList.add('active');
                    drawer.classList.add('open');
                    document.body.style.overflow = 'hidden'; // Lock background scroll
                }
            });
        });
        
        const closeDrawer = () => {
            backdrop.classList.remove('active');
            drawer.classList.remove('open');
            document.body.style.overflow = ''; // Unlock scroll
        };
        
        closeBtn.addEventListener('click', closeDrawer);
        backdrop.addEventListener('click', closeDrawer);
    }
}

// Contact Form Submission
function setupContactForm() {
    const form = document.getElementById('contactForm');
    const overlay = document.getElementById('successOverlay');
    const submitBtn = form ? form.querySelector('.submit-btn') : null;
    
    if (form && overlay) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('nameInput').value.trim();
            const email = document.getElementById('emailInput').value.trim();
            const message = document.getElementById('msgInput').value.trim();
            
            if (name && email && message) {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Shipping...';
                }

                // Submit to FormSubmit AJAX endpoint
                fetch('https://formsubmit.co/ajax/sumukh.workk@gmail.com', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message,
                        _subject: `New Portfolio Message from ${name}`
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Send Message';
                    }
                    overlay.classList.add('active');
                    form.reset();
                })
                .catch(error => {
                    console.error('Submission failed:', error);
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Send Message';
                    }
                    // Fallback to overlay and reset so user flow isn't broken
                    overlay.classList.add('active');
                    form.reset();
                });
            }
        });
        
        // Allow close of overlay
        overlay.addEventListener('click', () => {
            overlay.classList.remove('active');
        });
    }
}

// Initializations on load
document.addEventListener('DOMContentLoaded', () => {
    // Setup functions
    setupThemeToggle();
    setupCollapsibleExp();
    setupSlackSimulator();
    setupMetricsAnimator();
    setupNotionDrawer();
    setupContactForm();
    
    // Init theme
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
});
