require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// ── YOUR DETAILS ─────────────────────────────────────────────
const YOUR_EMAIL = 'joel@pineydigital.com';
const FROM_EMAIL = 'joel@pineydigital.com';  // Use your personal email
const CALENDLY_LINK = 'https://calendly.com/pineywoodsservices-info/30min';
// ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the friendly AI assistant for Piney Digital, a web design and digital growth company serving East Texas (Lufkin, Nacogdoches, Diboll, and surrounding areas). You work for Joel Escoto, the founder.

=== WHO YOU ARE ===
You help local business owners understand their options for websites and digital growth. You're knowledgeable, warm, and genuinely helpful — like talking to a friend who happens to know web design. You never push. You ask questions to understand needs, then suggest the right solution.

=== ABOUT JOEL ESCOTO ===
Joel moved to East Texas over 10 years ago and considers it home. He's worked as a server, welder, framer, and landscaper — so he understands what local businesses need. He built Piney Digital because too many East Texas businesses either have no website or have one that doesn't work for them. He lives in Lufkin with his wife and two kids.

=== SERVICE AREA ===
Lufkin, Nacogdoches, Diboll, Hudson, Huntington, Angelina County, and surrounding East Texas areas.

=== CONTACT INFO ===
Phone: (936) 299-9897
Email: joel@pineydigital.com
Website: pineydigital.com

=== THE PINEY OUTREACH SYSTEM ===
Piney Digital offers more than just websites. The Growth and Pro plans include the Piney Outreach system — a customer retention platform that helps businesses bring customers back:

**Digital Loyalty Cards:**
- Works through text messages, no app download needed
- Customers earn points for visits
- Automatic reminders when close to earning a reward
- Works great for restaurants, salons, coffee shops, any repeat business

**SMS Marketing:**
- Send promotions, reminders, and offers directly to customers' phones
- 98% open rate (vs 20% for email)
- Must have customer opt-in — no spam
- Included in Growth (500 msgs/mo) and Pro (2,000 msgs/mo)

**Automated Review Requests:**
- Automatically texts customers after a visit asking for a Google review
- Helps build Google Business Profile reviews
- More reviews = higher local ranking = more customers

**Why this matters:** A website brings people in. The Outreach system keeps them coming back. It's what separates Piney Digital from other web designers in East Texas.

=== PRICING (MONTHLY PLANS) ===

**STARTER — $99/month + $499 one-time setup**
- 5-page professional website
- Mobile-responsive design
- Google Business Profile setup
- Contact form + Google Maps
- Basic SEO optimization
- Hosting & SSL included
- Monthly updates (1 hour)
- Best for: New businesses just getting started

**GROWTH — $249/month + $799 one-time setup (MOST POPULAR)**
- Everything in Starter, PLUS:
- Digital loyalty card system
- SMS marketing (500 messages/month)
- Automated review requests
- Customer dashboard
- Monthly performance report
- Content updates (2 hours/month)
- Best for: Restaurants, salons, retail, any business with repeat customers

**PRO — $449/month + $1,199 one-time setup**
- Everything in Growth, PLUS:
- Online booking system
- Referral program tools
- Digital gift cards
- SMS marketing (2,000 messages/month)
- Unlimited content updates
- Priority same-day support
- Quarterly strategy calls
- Best for: Salons, med spas, gyms, businesses serious about growth

**ADD-ONS:**
- Rush Delivery (2-3 days): +$250
- Logo Design: +$300
- Photography Package: +$200
- Copywriting: +$150
- Additional Location Page: +$100
- Extra SMS Messages: +$25/month

=== KEY DIFFERENTIATORS ===
- Joel is local, not a big agency or overseas team
- Monthly plans mean ongoing support, not a one-time handoff
- The Outreach system (loyalty + SMS + reviews) is unique in East Texas — no other web designer offers this
- Fast delivery: 3-7 days for most projects
- Real person answers the phone: (936) 299-9897

=== WHY MONTHLY INSTEAD OF ONE-TIME? ===
If someone asks about one-time pricing, explain:
- Most web designers build a site and walk away
- Monthly means ongoing updates, hosting, and support included
- No hourly charges for small changes
- The Outreach system requires ongoing infrastructure (that's why Growth and Pro are monthly)
- For less than $10/day on the Growth plan, they get a website AND a customer retention system

=== LEAD QUALIFICATION FLOW ===
Have a natural conversation. Work these questions in organically — NOT all at once, NOT like a form. Ask 1-2 at a time based on the flow.

Questions to gather:
1. What industry/type of business do they have?
2. Do they currently have a website, or is this brand new?
3. Do they already have a domain name and hosting?
4. What's their timeline — are they in a hurry or flexible?
5. What's their rough budget range?
6. How did they hear about Piney Digital?

Then ask for:
- Their name
- Their email
- Their phone number (optional — say "optional" when asking)

=== OBJECTION HANDLING ===

"Too expensive" →
- Break it down: "At $99/month for the Starter plan, that's about $3/day — less than a cup of coffee."
- Mention the Growth plan is $8/day and includes the loyalty system that brings customers back.
- Ask about their current marketing spend (flyers, Facebook ads, etc.) and compare.

"Monthly? I want to pay once" →
- Explain that monthly includes hosting, updates, and support — no hourly charges for changes.
- The Outreach system requires ongoing infrastructure, which is why Growth and Pro are monthly.
- "Most web designers charge by the hour for updates. With the monthly plan, small changes are included."
- If they really want one-time, they can ask Joel directly: (936) 299-9897

"I already have a website" →
- "That's great — do you have a loyalty program or text message marketing set up?"
- Explain how the Outreach system can be added to existing websites.
- Ask if their current site brings customers back, or just sits there.

"Comparing other designers" →
- Highlight what's unique: the Outreach system (loyalty + SMS + reviews)
- Mention Joel is local, answers his own phone
- Fast delivery (3-7 days vs weeks/months for others)
- Monthly means ongoing support, not a one-time handoff

"Not sure what I need" →
- Ask about their business type: "Tell me about what you do."
- Restaurants and salons → recommend Growth (loyalty + SMS)
- New businesses → recommend Starter to start
- Established businesses wanting to grow → recommend Pro
- Ask about their biggest challenge: "What's the #1 thing you're hoping to fix?"

=== CRITICAL RULES FOR SENDING LEADS ===
- NEVER output LEAD_DATA until you have AT LEAST the person's name AND email
- NEVER output LEAD_DATA just because someone says "I'm interested" or "I want a website"
- Only output LEAD_DATA after you have name + email + at least some project context
- The more qualification info you collect before outputting LEAD_DATA, the better
- If someone is ready to book a call, share the Calendly link: ${CALENDLY_LINK}
- Share the Calendly link naturally, e.g. "You can grab a free 30-minute slot with Joel here: ${CALENDLY_LINK}"

=== PAYMENT / NEXT STEPS ===
When someone is ready to move forward:
1. They can book a free 30-minute consultation: ${CALENDLY_LINK}
2. They can call Joel directly: (936) 299-9897
3. They can fill out the form on pineydigital.com

Do NOT provide payment links. All payments go through Joel after the consultation.

=== TONE ===
Warm, friendly, concise — like texting a helpful local. Ask questions to understand their needs before suggesting solutions. Never pushy. You're here to help, not to close a deal.

=== LEAD CAPTURE ===
ONLY after you have name + email, add this on a NEW LINE at the very end of your message:
LEAD_DATA:{"name":"...","email":"...","phone":"...","industry":"...","hasWebsite":"yes/no","hasDomain":"yes/no","budget":"...","timeline":"...","referral":"...","project":"...","packageInterest":"starter/growth/pro/unsure","type":"lead or consultation"}

Use "" for any fields not yet collected. Phone is always optional.`;

const conversations = {};

app.post('/api/chat', async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message || !sessionId) return res.status(400).json({ error: 'message and sessionId required' });

  if (!conversations[sessionId]) conversations[sessionId] = [];
  conversations[sessionId].push({ role: 'user', content: message });

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...conversations[sessionId],
        ],
      }),
    });

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;
    conversations[sessionId].push({ role: 'assistant', content: assistantMessage });

    let leadData = null;
    let cleanMessage = assistantMessage;

    if (assistantMessage.includes('LEAD_DATA:')) {
      const parts = assistantMessage.split('LEAD_DATA:');
      cleanMessage = parts[0].trim();
      try {
        const parsed = JSON.parse(parts[1].trim());
        // Only send email if we actually have name + email
        if (parsed.name && parsed.name !== '' && parsed.email && parsed.email !== '') {
          leadData = parsed;
          console.log('New qualified lead:', leadData);
          await sendLeadEmail(leadData);
        } else {
          console.log('Lead data incomplete — email not sent yet');
        }
      } catch (e) { console.error('Lead parse error:', e); }
    }

    res.json({ message: cleanMessage, leadCaptured: !!leadData });
  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: 'AI response failed' });
  }
});

async function sendLeadEmail(lead) {
  const isConsult = lead.type === 'consultation';

  const row = (label, value) => value
    ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:13px;width:140px;">${label}</td><td style="padding:8px 0;color:#111827;font-weight:500;">${value}</td></tr>`
    : '';

  await resend.emails.send({
    from: `Piney Digital Assistant <${FROM_EMAIL}>`,
    to: YOUR_EMAIL,
    subject: isConsult
      ? `📅 Consultation Request — ${lead.name}`
      : `🎯 New Qualified Lead — ${lead.name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#1e4d2b,#2d7a47);padding:24px;border-radius:12px 12px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:20px;">🌲 Piney Digital — ${isConsult ? 'Consultation Request' : 'New Qualified Lead'}</h1>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">Collected by AI Assistant</p>
        </div>
        <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">

          <h3 style="margin:0 0 12px;color:#1e4d2b;font-size:15px;">👤 Contact Info</h3>
          <table style="width:100%;border-collapse:collapse;background:#fff;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">
            <tbody style="padding:12px;display:block;">
              ${row('Name', lead.name)}
              ${row('Email', `<a href="mailto:${lead.email}" style="color:#1e4d2b;">${lead.email}</a>`)}
              ${row('Phone', lead.phone ? `<a href="tel:${lead.phone}" style="color:#1e4d2b;">${lead.phone}</a>` : '')}
              ${row('Type', isConsult ? '📅 Consultation' : '💬 Quote Request')}
              ${row('Package Interest', lead.packageInterest)}
            </tbody>
          </table>

          <h3 style="margin:20px 0 12px;color:#1e4d2b;font-size:15px;">🏢 Business Info</h3>
          <table style="width:100%;border-collapse:collapse;background:#fff;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">
            <tbody style="padding:12px;display:block;">
              ${row('Industry', lead.industry)}
              ${row('Has Website?', lead.hasWebsite)}
              ${row('Has Domain?', lead.hasDomain)}
              ${row('Budget', lead.budget)}
              ${row('Timeline', lead.timeline)}
              ${row('Heard via', lead.referral)}
            </tbody>
          </table>

          ${lead.project ? `
          <h3 style="margin:20px 0 12px;color:#1e4d2b;font-size:15px;">📋 Project Details</h3>
          <div style="background:#fff;padding:14px;border-radius:8px;border:1px solid #e5e7eb;">
            <p style="margin:0;line-height:1.6;color:#374151;">${lead.project}</p>
          </div>` : ''}

          <div style="text-align:center;margin-top:24px;display:flex;gap:12px;justify-content:center;">
            <a href="mailto:${lead.email}" style="background:#1e4d2b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Reply to ${lead.name}</a>
            ${lead.phone ? `<a href="tel:${lead.phone}" style="background:#f0fdf4;color:#1e4d2b;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;border:1px solid #86efac;">Call ${lead.name}</a>` : ''}
          </div>

          <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:20px;">Sent from Piney Digital AI Assistant • pineydigital.com</p>
        </div>
      </div>`,
  });
  console.log(`✉️ Lead email sent: ${lead.name} (${lead.email})`);
}

// ── CONTACT FORM ENDPOINT ─────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, package, business, message, 'sms-consent': smsConsent } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    const row = (label, value) => value
      ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:13px;width:140px;">${label}</td><td style="padding:8px 0;color:#111827;font-weight:500;">${value}</td></tr>`
      : '';

    await resend.emails.send({
      from: `Piney Digital Contact <${FROM_EMAIL}>`,
      to: YOUR_EMAIL,
      subject: `📬 New Contact Form Submission — ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#1e4d2b,#2d7a47);padding:24px;border-radius:12px 12px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:20px;">🌲 Piney Digital — Contact Form</h1>
            <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">New submission from pineydigital.com</p>
          </div>
          <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
            <h3 style="margin:0 0 12px;color:#1e4d2b;font-size:15px;">👤 Contact Info</h3>
            <table style="width:100%;border-collapse:collapse;background:#fff;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">
              <tbody>
                ${row('Name', name)}
                ${row('Email', `<a href="mailto:${email}" style="color:#1e4d2b;">${email}</a>`)}
                ${row('Phone', phone ? `<a href="tel:${phone}" style="color:#1e4d2b;">${phone}</a>` : '')}
                ${row('Package Interest', package)}
                ${row('Business', business)}
                ${row('SMS Consent', smsConsent === 'yes' ? '✅ Yes, opted in for SMS' : 'No')}
              </tbody>
            </table>
            <h3 style="margin:20px 0 12px;color:#1e4d2b;font-size:15px;">💬 Message</h3>
            <div style="background:#fff;padding:14px;border-radius:8px;border:1px solid #e5e7eb;">
              <p style="margin:0;line-height:1.6;color:#374151;white-space:pre-wrap;">${message}</p>
            </div>
            <div style="text-align:center;margin-top:24px;display:flex;gap:12px;justify-content:center;">
              <a href="mailto:${email}" style="background:#1e4d2b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Reply to ${name}</a>
              ${phone ? `<a href="tel:${phone}" style="background:#f0fdf4;color:#1e4d2b;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;border:1px solid #86efac;">Call ${name}</a>` : ''}
            </div>
            <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:20px;">Sent from Piney Digital Contact Form • pineydigital.com</p>
          </div>
        </div>`,
    });
    console.log(`✉️ Contact form submitted: ${name} (${email})`);
    res.json({ success: true, message: 'Thanks! Joel will contact you within 24 hours.' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

app.delete('/api/chat/:sessionId', (req, res) => {
  delete conversations[req.params.sessionId];
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════════
// VAPI WEBHOOKS — AI Voice Call Callbacks
// ═══════════════════════════════════════════════════════════════

app.post('/webhook/vapi/call-ended', async (req, res) => {
  const data = req.body || {};
  console.log('📞 Vapi call-ended webhook received');
  console.log(JSON.stringify(data, null, 2).slice(0, 500));

  const callData = data.call || {};
  const callId = callData.id || 'unknown';
  const callStatus = callData.status || 'ended';
  const transcript = callData.transcript || '';
  const summary = callData.summary || '';
  const duration = callData.durationSeconds || 0;
  const customerNum = data.customer?.number || '';

  console.log(`  Call ID: ${callId}`);
  console.log(`  Status: ${callStatus}`);
  console.log(`  Duration: ${duration}s`);
  console.log(`  Customer: ${customerNum}`);

  // ── Determine call outcome ───────────────────────────────
  let outcome = 'called';
  let isHotLead = false;

  if (callStatus === 'transferred') {
    outcome = 'transferred';
    isHotLead = true;
  } else if (callStatus === 'voicemail') {
    outcome = 'voicemail';
  } else if (callStatus === 'no-answer') {
    outcome = 'no_answer';
  } else if (transcript) {
    const lower = transcript.toLowerCase();
    if (lower.includes('interested') || lower.includes('yes') && lower.includes('call back') || lower.includes('connect me')) {
      outcome = 'interested';
      isHotLead = true;
    } else if (lower.includes('not interested') || lower.includes('stop calling')) {
      outcome = 'declined';
    }
  }

  // ── Send email notification for hot leads ───────────────
  if (isHotLead || callStatus === 'transferred') {
    try {
      await resend.emails.send({
        from: `Piney Digital Calls <${FROM_EMAIL}>`,
        to: YOUR_EMAIL,
        subject: `🔥 HOT LEAD from AI Call — ${customerNum}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:linear-gradient(135deg,#dc2626,#ea580c);padding:24px;border-radius:12px 12px 0 0;">
              <h1 style="color:#fff;margin:0;font-size:20px;">🔥 HOT LEAD — AI Call</h1>
              <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px;">A lead wants to talk to you!</p>
            </div>
            <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
              <h3 style="margin:0 0 12px;color:#dc2626;font-size:15px;">📞 Call Details</h3>
              <table style="width:100%;border-collapse:collapse;background:#fff;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">
                <tbody>
                  <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;width:140px;">Status</td><td style="padding:8px 0;color:#111827;font-weight:600;text-transform:uppercase;">${outcome}</td></tr>
                  <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Phone</td><td style="padding:8px 0;color:#111827;font-weight:500;"><a href="tel:${customerNum}" style="color:#1e4d2b;">${customerNum}</a></td></tr>
                  <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Duration</td><td style="padding:8px 0;color:#111827;">${Math.floor(duration / 60)}m ${duration % 60}s</td></tr>
                  <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Call ID</td><td style="padding:8px 0;color:#6b7280;font-size:12px;">${callId}</td></tr>
                </tbody>
              </table>
              ${summary ? `
              <h3 style="margin:20px 0 12px;color:#1e4d2b;font-size:15px;">📝 Summary</h3>
              <div style="background:#fff;padding:14px;border-radius:8px;border:1px solid #e5e7eb;">
                <p style="margin:0;line-height:1.6;color:#374151;">${summary}</p>
              </div>` : ''}
              ${transcript ? `
              <h3 style="margin:20px 0 12px;color:#1e4d2b;font-size:15px;">💬 Transcript</h3>
              <div style="background:#fff;padding:14px;border-radius:8px;border:1px solid #e5e7eb;max-height:200px;overflow-y:auto;">
                <p style="margin:0;line-height:1.5;color:#374151;white-space:pre-wrap;font-size:13px;">${transcript.slice(0, 1000)}</p>
              </div>` : ''}
              <div style="text-align:center;margin-top:24px;">
                <a href="tel:${customerNum}" style="background:#dc2626;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">📞 Call Lead Now</a>
              </div>
              <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:20px;">AI Voice Call from Piney Digital • Vapi ID: ${callId}</p>
            </div>
          </div>`,
      });
      console.log(`📧 Hot lead email sent for call ${callId}`);
    } catch (error) {
      console.error('Failed to send hot lead email:', error);
    }
  }

  res.json({ status: 'ok', outcome, callId });
});

app.post('/webhook/vapi/transcript', (req, res) => {
  console.log('📝 Vapi transcript update');
  res.json({ status: 'ok' });
});

app.post('/webhook/vapi/status', (req, res) => {
  const data = req.body || {};
  console.log(`📞 Vapi status: ${data.call?.status || 'unknown'}`);
  res.json({ status: 'ok' });
});

app.get('/webhook/health', (req, res) => {
  res.json({ status: 'ok', service: 'Piney Digital Server', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Piney Digital AI running on port ${PORT}`));