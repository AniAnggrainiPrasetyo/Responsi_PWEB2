document.addEventListener("DOMContentLoaded", () => {
  loadData();

  // Form Tambah
  document.getElementById("addForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch("api.php", {
      method: "POST",
      body: formData
    }).then(() => {
      this.reset();
      loadData();
    });
  });

  // Form Cari
  document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
    loadData(keyword);
  });
});

function resetSearch() {
  document.getElementById("searchInput").value = "";
  loadData();
}

function loadData(keyword = "") {
  fetch("api.php")
    .then(res => res.json())
    .then(data => {
      const grouped = {};

      data.forEach((item, index) => {
        if (item.name.toLowerCase().includes(keyword)) {
          if (!grouped[item.category]) grouped[item.category] = [];
          item.index = index;
          grouped[item.category].push(item);
        }
      });

      const container = document.getElementById("tableContainer");
      container.innerHTML = "";

      if (Object.keys(grouped).length === 0) {
        container.innerHTML = "<p><i>Tidak ada item yang cocok.</i></p>";
        return;
      }

      const template = document.getElementById("categoryTemplate");

      Object.keys(grouped).sort().forEach(category => {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".category-title").textContent = `📦 ${category}`;

        const tbody = clone.querySelector("tbody");

        grouped[category].forEach((item, i) => {
          const statusText = item.purchased ? "Sudah" : "Belum";
          const statusClass = item.purchased ? "status-sudah" : "status-belum";
          const toggleText = item.purchased ? "Belum Dibeli" : "Selesai Dibeli";

          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${i + 1}</td>
            <td>${item.name}</td>
            <td>${item.year}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>
              <button onclick="toggleStatus(${item.index})">${toggleText}</button>
              <button onclick="editItem(${item.index})">Edit</button>
              <button onclick="deleteItem(${item.index})">Hapus</button>
            </td>
          `;
          tbody.appendChild(row);
        });

        container.appendChild(clone);
      });
    });
}

function toggleStatus(index) {
  fetch(`api.php?action=toggle&index=${index}`).then(() => loadData());
}

function deleteItem(index) {
  fetch(`api.php?action=delete&index=${index}`).then(() => loadData());
}

function editItem(index) {
  const newName = prompt("Masukkan nama baru:");
  if (newName) {
    fetch(`api.php?action=edit&index=${index}&name=${encodeURIComponent(newName)}`)
      .then(() => loadData());
  }
}
