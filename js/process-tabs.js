/**
 * Manufacturing Process Tabs
 * Desktop: click tabs to switch steps. Tablet/Mobile: prev/next navigation.
 * Displays content for all 8 manufacturing stages.
 */
function initProcessTabs() {
  const tabs = document.querySelectorAll('.process__tab');
  const badge = document.getElementById('processStepBadge');
  const title = document.getElementById('processCardTitle');
  const desc = document.getElementById('processCardDesc');
  const bullets = document.getElementById('processCardBullets');
  const prevBtn = document.getElementById('processPrev');
  const nextBtn = document.getElementById('processNext');

  if (!tabs.length || !badge) return;

  /* Step data for all 8 manufacturing stages */
  const steps = [
    {
      name: 'Raw Material',
      title: 'High-Grade Raw Material Selection',
      desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
      bullets: ['PE100 grade material', 'Optimal molecular weight distribution']
    },
    {
      name: 'Extrusion',
      title: 'Precision Extrusion Process',
      desc: 'State-of-the-art single and twin screw extruders heat and shape the raw HDPE material into continuous pipe profiles with precise wall thickness.',
      bullets: ['Temperature-controlled zones', 'Consistent melt flow rate']
    },
    {
      name: 'Cooling',
      title: 'Controlled Cooling System',
      desc: 'Multi-stage cooling tanks gradually reduce pipe temperature to prevent warping and ensure dimensional stability throughout the length.',
      bullets: ['Spray and immersion cooling', 'Uniform crystallization']
    },
    {
      name: 'Sizing',
      title: 'Vacuum Sizing Calibration',
      desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
      bullets: ['Tight tolerance control', 'Automated diameter monitoring']
    },
    {
      name: 'Quality Control',
      title: 'Rigorous Quality Testing',
      desc: 'Every pipe undergoes comprehensive quality checks including hydrostatic testing, dimensional verification, and material property analysis.',
      bullets: ['100% pressure testing', 'ISO 4427 compliance']
    },
    {
      name: 'Marking',
      title: 'Permanent Product Marking',
      desc: 'Laser and inkjet marking systems apply essential product information including size, pressure rating, manufacturing date, and batch traceability codes.',
      bullets: ['Full traceability', 'BIS marking standards']
    },
    {
      name: 'Cutting',
      title: 'Precision Cutting & Finishing',
      desc: 'Automated planetary saws deliver clean, burr-free cuts at specified lengths while maintaining pipe end squareness for reliable joint connections.',
      bullets: ['Chip-free cutting technology', 'Custom length capability']
    },
    {
      name: 'Packaging',
      title: 'Secure Packaging & Dispatch',
      desc: 'Pipes are carefully bundled, strapped, and loaded using proper handling equipment to prevent damage during transportation and storage.',
      bullets: ['Protective bundling', 'Safe logistics handling']
    }
  ];

  let current = 0;

  function goToStep(index) {
    current = index;
    const step = steps[index];

    /* Update tabs (desktop) */
    tabs.forEach((tab, i) => {
      tab.classList.toggle('process__tab--active', i === index);
      tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    /* Update badge (tablet/mobile) */
    badge.textContent = `Step ${index + 1}/${steps.length}: ${step.name}`;

    /* Update card content */
    title.textContent = step.title;
    desc.textContent = step.desc;
    bullets.innerHTML = step.bullets
      .map(b => `<li><span class="dot dot--blue" aria-hidden="true"></span>${b}</li>`)
      .join('');
  }

  /* Tab click handlers */
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      goToStep(parseInt(tab.dataset.step, 10));
    });
  });

  /* Prev / Next (mobile) */
  prevBtn.addEventListener('click', () => {
    goToStep((current - 1 + steps.length) % steps.length);
  });

  nextBtn.addEventListener('click', () => {
    goToStep((current + 1) % steps.length);
  });
}
