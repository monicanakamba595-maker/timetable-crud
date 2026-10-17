const API = 'http://localhost:3000/api/timetable';
const fields = ['course_code','course_name','lecturer','day_of_week','start_time','end_time','venue','goal'];

const form = document.getElementById('form');
const rows = document.getElementById('rows');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');

async function load() {
  const res = await fetch(API);
  const data = await res.json();
  rows.innerHTML = '';
  data.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.id}</td><td>${r.course_code}</td><td>${r.course_name || ''}</td>
      <td>${r.lecturer || ''}</td><td>${r.day_of_week || ''}</td>
      <td>${r.start_time || ''}</td><td>${r.end_time || ''}</td>
      <td>${r.venue || ''}</td><td>${r.goal || ''}</td>
      <td>
        <button onclick='editRow(${JSON.stringify(r)})'>Edit</button>
        <button onclick="deleteRow(${r.id})">Delete</button>
      </td>`;
    rows.appendChild(tr);
  });
}

function editRow(r) {
  document.getElementById('id').value = r.id;
  fields.forEach(f => document.getElementById(f).value = r[f] || '');
  saveBtn.textContent = 'Update';
  cancelBtn.style.display = 'inline';
}

function resetForm() {
  form.reset();
  document.getElementById('id').value = '';
  saveBtn.textContent = 'Add';
  cancelBtn.style.display = 'none';
}

async function deleteRow(id) {
  if (!confirm('Delete this record?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  load();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {};
  fields.forEach(f => body[f] = document.getElementById(f).value);
  const id = document.getElementById('id').value;
  await fetch(id ? `${API}/${id}` : API, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  resetForm();
  load();
});

cancelBtn.addEventListener('click', resetForm);
load();