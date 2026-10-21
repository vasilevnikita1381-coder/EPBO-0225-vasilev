document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Навигация
  fetch('dataset/navigation.json')
    .then(response => response.json())
    .then(data => {
      const nav = document.getElementById('main-nav');
      nav.innerHTML = ''; 
      data.forEach(item => {
        const link = document.createElement('a');
        link.href = `#${item.target || 'tracks'}`;
        link.textContent = item.label || 'Ссылка';
        nav.appendChild(link);
      });
    })
    .catch(() => console.log('Файл navigation.json не найден'));

  // 2. Карточки
  fetch('dataset/content.csv')
    .then(response => response.text())
    .then(csvText => {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) return;

      const headers = lines[0].split(';').map(h => h.trim());
      const cardsContainer = document.getElementById('cards-container');
      cardsContainer.innerHTML = ''; 

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(';').map(v => v.trim());
        
        const row = {};
        headers.forEach((header, index) => { row[header] = values[index]; });

        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
          <h3>${row.title || 'Без названия'}</h3>
          <p><strong>Категория:</strong> ${row.category}</p>
          <p>${row.description || 'Описание отсутствует'}</p>
          <span class="badge">Баллов: ${row.value}</span>
        `;
        cardsContainer.appendChild(card);
      }
    })
    .catch(() => {
      document.getElementById('cards-container').innerHTML = 
        '<p style="color:red">Не удалось загрузить карточки.</p>';
    });

  // 3. Таблица (если ты успел поменять tbody в HTML)
  fetch('dataset/content.csv')
    .then(response => response.text())
    .then(csvText => {
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(';').map(h => h.trim());
      const tbody = document.getElementById('schedule-body');
      
      if (!tbody) return; 

      tbody.innerHTML = ''; 

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(';').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => { row[header] = values[index]; });

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>10:00</td>
          <td>${row.title}</td>
          <td>${row.category}</td>
          <td>${row.value}</td>
        `;
        tbody.appendChild(tr);
      }
    });
});