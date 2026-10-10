// STAN PANEL — 정적 SEO 본문(section.seo)의 영어판. ?lang=en 응답에서만 functions/_middleware.js 가 러시아어 본문을 이걸로 갈아끼운다.
// 원문: apps/stans/index.html 의 section.seo(러시아어) — 같은 사실만 옮긴 번역. 원문을 고치면 여기도 같이 고칠 것.
// FAQ 는 화면 문구와 FAQPage JSON-LD 가 같아야 하므로 한 데이터(FAQ_EN)에서 둘 다 만든다.

export const FAQ_EN = [
  ['Do citizens of Kyrgyzstan need a patent?',
    'No. Kyrgyzstan is a member of the EAEU, so its citizens work in Russia under an employment or civil-law contract without a patent. Migration registration and a VHI (DMS) insurance policy are still mandatory.'],
  ['What happens if I miss a monthly patent payment?',
    'The patent automatically stops being valid from the day after the last paid day. It cannot be restored — you have to apply for a new one. Working with an invalid patent risks a fine and removal from the country, so pay a few days before the patent issue date.'],
  ['How do I find the exact patent payment for my region?',
    'Amount = 1,200 ₽ × deflator coefficient × regional coefficient, and both change every year. Check the exact figure on the website of the Federal Tax Service (FNS) of Russia or your regional government — tables online go out of date quickly.'],
  ['Which way of sending money home is the cheapest?',
    'The one where your family receives more for the same amount sent. Compare the final amount received against the mid-market rate, not the fee — the calculator on the Money tab shows the full transfer cost as a percentage.'],
  ['Why is the power cut in Tajikistan in winter?',
    'Hydropower plants provide more than 90% of the country’s electricity. In winter river inflow is at its lowest while demand is at its peak, so Barqi Tojik introduces supply limits — usually from autumn until the end of March or April. Cities are affected less, villages more.'],
  ['Is it true that a migration card with the purpose “work” cannot be corrected later?',
    'The purpose of the visit is recorded on entry, and a patent is only issued when the purpose is “work”. In practice a correction means leaving and re-entering the country, so check the entry at the border straight away.'],
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const FAQ_LD_EN = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: 'en',
  mainEntity: FAQ_EN.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

// index.html 의 WebApplication JSON-LD(data-ld="app")의 영어판 — 같은 사실만 옮김. 원문을 고치면 여기도 같이 고칠 것.
export const APP_LD_EN = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'STAN PANEL',
  alternateName: 'Stan Panel — money, documents, power and USSD for Central Asia',
  url: 'https://stans.broodev.com/',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web',
  inLanguage: ['ru', 'en'],
  isAccessibleForFree: true,
  publisher: { '@type': 'Organization', name: 'Y-Systems', url: 'https://broodev.com/' },
  featureList: 'RUB to UZS/KGS/TJS transfer cost calculator, live exchange rates, guide to the Russian patent and migration registration, winter power outages in Tajikistan, mobile operator USSD codes, hacker terminal',
};

export const BODY_EN = `
      <h2>What is STAN PANEL?</h2>
      <p>
        STAN PANEL is a free, lightweight page for everyday tasks of residents and labour migrants from
        <strong>Uzbekistan, Kyrgyzstan and Tajikistan</strong>. One tab has live dollar and ruble rates against
        <strong>UZS, KGS and TJS</strong> (mid-market, open.er-api.com) and a calculator that shows the
        <strong>real cost of sending RUB home</strong>: the fee plus the hidden margin in the exchange rate. The second tab is a clear
        guide to the <strong>patent and migration registration</strong> for work in Russia, with official links. Next comes an
        explanation of <strong>winter electricity limits in Tajikistan</strong> with the current temperature in three capitals,
        <strong>USSD code</strong> tables by operator, and a hacker terminal for those who like the command line.
        No ads, no sign-up — settings are stored only in your browser.
      </p>

      <h2>Work patent in Russia: the first 30 days after entry</h2>
      <p>
        Citizens of Uzbekistan and Tajikistan need a <strong>patent</strong> to work legally for Russian employers. The key rule:
        the patent application is filed <strong>within 30 calendar days of the date of entry</strong> — if you are late a fine is
        imposed, and for some time now the documents may not be accepted at all. Before applying you must: get a migration card with
        the purpose of visit <strong>“work”</strong> (it is marked at the border — correcting it later is hard), complete migration
        registration, pass a <strong>medical examination</strong> at an authorised organisation, pass the exam in Russian language,
        history and the basics of law, complete <strong>fingerprinting and photographing</strong>, take out a VHI (DMS) policy and
        pay the first advance personal income tax (NDFL) payment. In Moscow everything is done through the MMC (“Sakharovo”),
        in the regions through the migration units of the Ministry of Internal Affairs (MVD).
      </p>

      <h2>Monthly patent payment: how much and how it is calculated</h2>
      <p>
        The patent stays valid as long as the <strong>fixed advance NDFL payment</strong> is paid. The amount is calculated as:
        base rate 1,200 ₽ × deflator coefficient (set every year) × regional coefficient (set by the law of each Russian region).
        That is why every region has its own price, and it changes every year. Reference figures for 2026
        (<strong>approximate amounts</strong> — check the exact figure on the FNS or regional government website before paying):
      </p>
      <table>
        <tr><th>Region</th><th>Monthly payment (approx.)</th></tr>
        <tr><td>Moscow</td><td>≈ 8,900 – 9,500 ₽</td></tr>
        <tr><td>Moscow Oblast</td><td>≈ 8,500 – 9,200 ₽</td></tr>
        <tr><td>Saint Petersburg and Leningrad Oblast</td><td>≈ 4,600 – 5,400 ₽</td></tr>
        <tr><td>Most other regions</td><td>≈ 5,000 – 9,000 ₽</td></tr>
      </table>
      <p>
        You can pay through a bank using the regional FNS payment details, at terminals and through online banking.
        <strong>Keep every receipt</strong> — it is the only proof that the patent was valid in a given month.
      </p>

      <h2>What a late patent payment means</h2>
      <p>
        The most common and the most expensive mistake. The patent stops being valid <strong>from the day after the last paid
        day</strong> — not from the end of the month and not after a warning. Being even one day late means: the patent is cancelled,
        your work has become illegal, and the document cannot be restored — only applied for again (new medical examination, exam,
        payments). Working without a valid patent means a fine of around <strong>5,000 – 7,000 ₽</strong> with possible
        <strong>administrative removal</strong> and an entry ban for several years. Practical rules: pay at least
        <strong>3–5 days before the patent issue date</strong> (that date, not the first of the month, sets the cycle), you can pay
        several months in advance, and double-check the payment purpose — a mistake in the payment details counts as non-payment.
      </p>

      <h2>How to really compare the cost of sending RUB home</h2>
      <p>
        Transfer providers earn twice: on the <strong>fee</strong>, which you can see, and on the
        <strong>margin in the exchange rate</strong>, which you cannot. “0% fee” almost always means the provider’s rate is 1–4%
        worse than mid-market. An honest comparison works like this: take the amount in rubles, find out
        <strong>how many sum/som/somoni your family will actually receive</strong>, and compare it with the amount at the mid-market
        rate. Formula: total cost % = (amount × mid rate − actually received) ÷ (amount × mid rate) × 100.
        Example: you send 10,000 ₽ at a mid rate of 1 ₽ = 155 UZS. At mid-market that is 1,550,000 sum.
        If your family receives 1,480,000, the total transfer cost is <strong>4.5%</strong>, whatever the advert promises.
        The calculator on the Money tab does this automatically at today’s rate.
      </p>

      <h2>Money transfer systems from Russia: what to consider</h2>
      <p>
        The main channels for sending RUB to Central Asia are specialised money transfer systems and bank cards. The fees below are
        <strong>approximate</strong> and change: always check the final amount to be received before confirming a transfer.
      </p>
      <table>
        <tr><th>Channel</th><th>How it works</th><th>Fee (approx.)</th></tr>
        <tr><td><a href="https://koronapay.com/" rel="noopener">Zolotaya Korona (KoronaPay)</a></td><td>Cash pick-up or payout to a card at partner banks in UZ/KG/TJ</td><td>Often 0–1% when paid out in local currency — the margin sits in the rate</td></tr>
        <tr><td><a href="https://unistream.ru/" rel="noopener">Unistream</a></td><td>Network of pick-up points and partner banks</td><td>≈ 0–1.5% + exchange-rate margin</td></tr>
        <tr><td>Bank cards / transfers by phone number</td><td>Transfer to a local bank card, if the bank supports it</td><td>Depends on the bank; check the RUB→local currency conversion rate</td></tr>
      </table>
      <p>
        There is one rule: compare not the “fee” but the <strong>amount received</strong> for the same amount sent.
      </p>

      <h2>Migration registration: deadlines and fines</h2>
      <p>
        After entering Russia a foreign citizen must complete <strong>migration registration at the place of stay</strong>.
        The general rule is <strong>7 working days</strong>, but intergovernmental agreements give longer deadlines:
        citizens of EAEU states (including <strong>Kyrgyzstan</strong>) have up to 30 days, and citizens of
        <strong>Tajikistan</strong> have an extended deadline under a bilateral agreement (check the current version).
        Registration is done by the <strong>host party</strong> — the property owner, a hotel or the employer; the notification can
        be filed through an MFC centre, the post office or Gosuslugi. Living without registration means a fine of around
        2,000 – 5,000 ₽ (up to 7,000 ₽ in Moscow and Saint Petersburg) with a risk of removal for a repeat violation.
        “Rubber” addresses and bought registrations without actually living there are a criminal risk for the host party and mean
        cancelled documents for the migrant.
      </p>

      <h2>Kyrgyzstan and the EAEU: why Kyrgyz citizens do not need a patent</h2>
      <p>
        Kyrgyzstan is a member of the <strong>Eurasian Economic Union</strong> (since 2015), so its citizens work in Russia
        <strong>without a patent or a work permit</strong> — an employment or civil-law contract is enough. The deadline for
        migration registration for working EAEU citizens is up to 30 days, and a valid contract lets you extend your stay for its
        term. Uzbekistan and Tajikistan are not in the EAEU, so a patent is mandatory for their citizens. This is the main fork to
        understand when moving: a Kyrgyz citizen saves both money (the monthly patent payments) and time (no medical examination or
        exam for a patent), but registration and a VHI (DMS) policy are needed by everyone.
      </p>

      <h2>Winter electricity limits in Tajikistan: why and when</h2>
      <p>
        Tajikistan gets <strong>more than 90% of its electricity from hydropower plants</strong>, above all the Nurek HPP.
        In winter river inflow falls several times over, while consumption peaks — heating in the country is largely electric.
        The gap is covered by <strong>limits</strong>: the energy holding Barqi Tojik introduces supply schedules, usually
        <strong>from late September–October until late March–April</strong>. In a typical limit season rural areas get electricity
        for a few hours in the morning and evening; Dushanbe and large cities are limited more lightly or not at all. Exact
        schedules change from year to year depending on water levels — follow announcements from Barqi Tojik and local
        authorities. Completion of the Rogun HPP is gradually increasing winter output, but for now seasonal limits remain a reality.
      </p>

      <h2>Operator USSD codes: Uzbekistan, Kyrgyzstan, Tajikistan</h2>
      <p>
        Quick codes are the cheapest way to check your balance without an app or internet.
        <strong>Codes change</strong> — if a code does not work, check the operator’s website.
      </p>
      <table>
        <tr><th>Country</th><th>Operator</th><th>Balance</th><th>Website</th></tr>
        <tr><td>🇺🇿 UZ</td><td>Beeline</td><td>*102#</td><td><a href="https://beeline.uz/" rel="noopener">beeline.uz</a></td></tr>
        <tr><td>🇺🇿 UZ</td><td>Ucell</td><td>*100#</td><td><a href="https://ucell.uz/" rel="noopener">ucell.uz</a></td></tr>
        <tr><td>🇺🇿 UZ</td><td>Mobiuz (formerly UMS)</td><td>*100#</td><td><a href="https://mobi.uz/" rel="noopener">mobi.uz</a></td></tr>
        <tr><td>🇰🇬 KG</td><td>Beeline</td><td>*102#</td><td><a href="https://beeline.kg/" rel="noopener">beeline.kg</a></td></tr>
        <tr><td>🇰🇬 KG</td><td>MegaCom</td><td>*100#</td><td><a href="https://megacom.kg/" rel="noopener">megacom.kg</a></td></tr>
        <tr><td>🇰🇬 KG</td><td>O!</td><td>*111#</td><td><a href="https://o.kg/" rel="noopener">o.kg</a></td></tr>
        <tr><td>🇹🇯 TJ</td><td>Tcell</td><td>*111#</td><td><a href="https://tcell.tj/" rel="noopener">tcell.tj</a></td></tr>
        <tr><td>🇹🇯 TJ</td><td>MegaFon TJ</td><td>*100#</td><td><a href="https://megafon.tj/" rel="noopener">megafon.tj</a></td></tr>
        <tr><td>🇹🇯 TJ</td><td>Babilon-Mobile</td><td>*121#</td><td><a href="https://babilon-m.tj/" rel="noopener">babilon-m.tj</a></td></tr>
      </table>
      <p>
        Never give your PIN or SMS codes to “operator staff” — operators never ask for them.
      </p>

      <h2>Official sources worth using</h2>
      <p>
        Check anything about the status of your documents only on official resources — a paid “entry ban check” on third-party
        sites is almost always a scam. The main addresses:
        <a href="https://гувм.мвд.рф/" rel="noopener">GUVM of the Russian MVD</a> (migration, patents, entry ban check),
        <a href="https://www.gosuslugi.ru/" rel="noopener">Gosuslugi</a> (notifications, appointments),
        <a href="https://mc.mos.ru/" rel="noopener">Moscow MMC (“Sakharovo”)</a> (patent processing in Moscow),
        <a href="https://www.nalog.gov.ru/" rel="noopener">FNS of Russia</a> (patent payment details and amounts),
        <a href="http://www.barqitojik.tj/" rel="noopener">Barqi Tojik</a> (Tajikistan’s power supply),
        <a href="https://minenergy.uz/" rel="noopener">Ministry of Energy of Uzbekistan</a> and
        <a href="https://severelectro.kg/" rel="noopener">Severelectro</a> (outages in Bishkek and Chuy Region).
        STAN PANEL does not store personal data and does not run checks for you — it only gives you the right links.
      </p>

      <h2>Frequently asked questions (FAQ)</h2>
${FAQ_EN.map(([q, a]) => `      <p><strong>${esc(q)}</strong><br />\n        ${esc(a)}</p>`).join('\n')}
    `;
