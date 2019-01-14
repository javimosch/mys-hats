var socket = io.connect('http://localhost:3000');
socket.on('connect', function() {
	console.log('connect 2')
});
socket.on('reload',(data)=>{
	document.querySelector('.app').innerHTML = data.html.app;
	//document.querySelector('head').innerHTML = data.html.head;
	console.log('change!')
});