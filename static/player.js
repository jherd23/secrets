function reroll(playername) {
  const request = new XMLHttpRequest()
  request.open('POST', `/reroll/${playername}`);
  request.onreadystatechange = () => {
    if(request.readyState === 4 && request.status === 200) {
      location.reload();
    }
  }

  request.send()
}
