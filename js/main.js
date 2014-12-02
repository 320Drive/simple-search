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

    $('.common-queries').hide();
    $('.about').hide();
    query = $('#search-field').val();
    query = parseQuery();

    $('.no-results strong').html(' '+query);

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
            console.log(data.response);
        }
    });
}

function renderSearchResults(searchResults) {
    $('a.list-group-item').remove();
    $('.no-results').hide();

    $('#result-stat').fadeIn(1000).html(searchResults.numFound+" results.");
    if(searchResults.numFound===0){
        $('.no-results').fadeIn(1000);
    }
    for (var i = 0; i < searchResults.docs.length; i++) {
        var title = searchResults.docs[i].title;
        var url = searchResults.docs[i].url;
        var resultItem = $('<a>', {href: url, target:'_blank', class:'list-group-item', text: title});
        $('.search-results .list-group').append(resultItem);
    }
	$('.search-results').append('<br />');
	var prevLink = $('<a>', {href: '#', text: 'Prev page', id: 'prev-page'});
	var nextLink = $('<a>', {href: '#', text: 'Next page', id: 'next-page'});
	if (start > 0) {
		$('.search-results .container').append(prevLink);
	}
	if ((start + 10) < searchResults.numFound) {
		$('.search-results .container').append(nextLink);
	}
}
$('document').ready(function(){

    $('#result-stat').hide();
    $('.no-results').hide();

});