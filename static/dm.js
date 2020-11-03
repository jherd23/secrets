function reset() {
  const request = new XMLHttpRequest()
  request.open('POST', '/reset');
  request.onreadystatechange = () => {
    if(request.readyState === 4 && request.status === 200) {
      location.reload();
    }
  }

  request.send()
}
