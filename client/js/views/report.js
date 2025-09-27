export default async function Report(){
  const data = await window.API.reportSummary();
  const labels = Object.keys(data.hoursByPIC || {});
  const values = Object.values(data.hoursByPIC || {});

  const html = `
    <div class="card">
      <h3>Report: Hours by PIC</h3>
      <canvas id="reportChart" height="140"></canvas>
    </div>
  `;

  window.__afterRender = () => {
    const ctx = document.getElementById('reportChart');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Hours', data: values }] },
      options: {
        plugins:{ legend:{ labels:{ color:'#e6eef5' } } },
        scales: { x:{ ticks:{ color:'#9bb0bf' } }, y:{ ticks:{ color:'#9bb0bf' } } }
      }
    });
  };

  return html;
}
