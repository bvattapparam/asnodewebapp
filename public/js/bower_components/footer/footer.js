define(['jquery'], function($){
	$(".helpPopup").click(function(e) {
		var url="/asnodewebapp/todo"
		e.preventDefault();
		window.open(url, '', "scrollbars=1,height=500,width=1000");
	});
});
