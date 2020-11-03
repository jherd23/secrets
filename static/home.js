function goToPage() {
  const playerName = document.getElementById('name_input').value;
  window.location.href = `/view/${playerName}`;
}
