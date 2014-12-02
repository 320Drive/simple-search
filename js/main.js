skrollr.init(
	{
		smoothScrolling:true,
		smoothScrollingDuration:1000,
		render: function(data) {
	        //Log the current scroll position.
	        //console.log(data.curTop);
	    }
	}
);

var query = '';
var start = 0;
$('#search-form').submit(function(e) {
    e.preventDefault();
    $('.search-section').fadeOut('normal', function() {
        $(this).hide();
    });
    $('.content-wrapper').css('padding', '150px 0px 400px');
    $('.common-queries').hide();
    $('.about').hide();
    query = $('#search-field').val();
    query = parseQuery();
    solrSearch();
    $('.search-results').show();
	$('.search-results .container').on('click', '#prev-page', function() {
		start = start - 10;
		solrSearch();
	});
	$('.search-results .container').on('click', '#next-page', function() {
		start = start + 10;
		solrSearch();
	});
});

function parseQuery() {
    var parsedQuery = query.split(' ').join('+');
    return parsedQuery;
}

function solrSearch() {
    $.ajax({
        async: false,
        type: 'GET',
        url: 'http://128.208.102.114:8080/select',
        dataType: 'JSONP',
        data: {
            'q': 'title:' + query,
            'wt': 'json',
            'indent': false,
            'fl': 'url,title',
            'score': 'score desc',
			'rows': '10',
			'start': start
        },
        jsonp: 'json.wrf',
        success: function (data, textStatus, jqXHR) {
            renderSearchResults(data.response);
        }
    });
}

function renderSearchResults(searchResults) {
	$('.search-results .container').empty();
    for (var i = 0; i < searchResults.docs.length; i++) {
        var title = searchResults.docs[i].title;
        var url = searchResults.docs[i].url;
        var resultItem = $('<a>', {href: url, text: title});
        $('.search-results .container').append(resultItem).append('<br />');
    }
	$('.search-results .container').append('<br />');
	var prevLink = $('<a>', {href: '#', text: 'Prev page', id: 'prev-page'});
	var nextLink = $('<a>', {href: '#', text: 'Next page', id: 'next-page'});
	if (start > 0) {
		$('.search-results .container').append(prevLink);
	}
	if ((start + 10) < searchResults.numFound) {
		$('.search-results .container').append(nextLink);
	}
}