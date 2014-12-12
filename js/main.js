skrollr.init({
    smoothScrolling: true,
    smoothScrollingDuration: 2000,
    scale: 1
        // render: function(data) {
        //        Log the current scroll position.
        //        console.log(data.curTop);
        //    }
});

var resultsJSON;

/*==========  Angular Data | Start ==========*/
angular.module('driveApp', [])
    .controller('display', function($scope) {

        $scope.queries = [{
            "query": "car oil change"
        }, {
            "query": "filter change"
        }, {
            "query": "maintenance"
        }, {
            "query": "car noise"
        }, {
            "query": "reduce noise"
        }, {
            "query": "used cars"
        }, {
            "query": "BMW 4 series"
        }, {
            "query": "safe driving"
        }, {
            "query": "reduce smoke"
        }, {
            "query": "used tires"
        }, {
            "query": "honda accord"
        }, {
            "query": "electic cars"
        }];

        $scope.searchQuery = function(query){
            $scope.searchInput=query;

            $.smoothScroll({
                scrollTarget: '.wrapper',
                offset: 10
            });

        }


    });
/*==========  Angular Data | End ==========*/



var query = '';
var start = 0;
$('#search-form').submit(function(e) {
    e.preventDefault();

    $('.common-queries').hide();
    $('.about').hide();
    $('.articles').hide();
    query = $('#search-field').val();
    query = parseQuery();

    $('.no-results strong').html(' ' + query);

    solrSearch();
    $('.search-results').show();
    $('.search-results .pagination').on('click', '#prev-page', function() {
        start = start - 10;
        solrSearch();
    });
    $('.search-results .pagination').on('click', '#next-page', function() {
        start = start + 10;
        solrSearch();
    });
});

function parseQuery() {
    var parsedQuery = query.split(' ').join(' ');
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
        success: function(data, textStatus, jqXHR) {
            renderSearchResults(data.response);
            resultsJSON=data.response;
            console.log(resultsJSON);  
        }
    });
}

function renderSearchResults(searchResults) {

    var resultNumbers = searchResults.numFound;
    var startID = searchResults.start; 

    $.smoothScroll({
        scrollTarget: '.content-wrapper',
        offset: -100,
        speed:500
    });

    $('a.list-group-item').remove();
    $('.no-results').hide();

    $('#result-stat').fadeIn(1000).html(searchResults.numFound + " results.");
    if (searchResults.numFound === 0) {
        $('.no-results').fadeIn(1000);
    }
    for (var i = 0; i < searchResults.docs.length; i++) {
        var title = searchResults.docs[i].title;
        var url = searchResults.docs[i].url;
        var resultItem = $('<a>', {
            href: url,
            target: '_blank',
            class: 'list-group-item',
            text: url
        });
        resultItem.prepend($('<h4>',{text:title}));
        $('.search-results .list-group').append(resultItem);
    }
    $('.search-results').append('<br />');
    $('.search-results .pagination li').remove();
    var prevLink = $('<li id="prev-page"><a href="#"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>');
    var nextLink = $('<li id="next-page"><a href="#"><span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span></a></li>');
    if (start > 0) {
        $('.search-results .pagination').append(prevLink);
    }

    if ((start + 10) < searchResults.numFound) {
        $('.search-results .pagination').append(nextLink);
    }
}
$('document').ready(function() {

    $('#result-stat').hide();
    $('.no-results').hide();

});

