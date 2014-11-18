skrollr.init(
	{
		smoothScrolling:true,
		smoothScrollingDuration:1000,
		render: function(data) {
	        //Log the current scroll position.
	        console.log(data.curTop);
	    }
	}
);