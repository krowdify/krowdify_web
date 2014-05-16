/*
 * entities.js
 * This function converts a post with "entity" metadata 
 * from plain text to linkified HTML.
 *
 *
 * Copyright 2010, Wade Simmons
 * Licensed under the MIT license
 * http://wades.im/mons
 *
 * Requires jQuery
 * This was modified as per MIT License for use with krowd.io since the 
 * entities structure is the same and this works very well we borrowed it and modified.
 */
 
function escapeHTML(text) {
    return $('<div/>').text(text).html()
}
 
function linkify_entities(post) {
    if (!(post.entities)) {
        return escapeHTML(post.usertext)
    }
    
    // This is very naive, should find a better way to parse this
    var index_map = {}
    
    $.each(post.entities.urls, function(i,entry) {
        index_map[entry.indices[0]] = [entry.indices[1], function(text) {return "<a href='"+escapeHTML(entry.url)+"'>"+escapeHTML(text)+"</a>"}]
    })
    
    $.each(post.entities.hashtags, function(i,entry) {
        index_map[entry.indices[0]] = [entry.indices[1], function(text) {return "<a href='search?q="+escape("#"+entry.text)+"'>"+escapeHTML(text)+"</a>"}]
    })
    
    $.each(post.entities.user_mentions, function(i,entry) {
        index_map[entry.indices[0]] = [entry.indices[1], function(text) {return "<a title='"+escapeHTML(entry.name)+"' href='user.html?user="+escapeHTML(entry._id)+"'>"+escapeHTML(text)+"</a>"}]
    })
    
    var result = ""
    var last_i = 0
    var i = 0
    
    // iterate through the string looking for matches in the index_map
    for (i=0; i < post.usertext.length; ++i) {
        var ind = index_map[i]
        if (ind) {
            var end = ind[0]
            var func = ind[1]
            if (i > last_i) {
                result += escapeHTML(post.usertext.substring(last_i, i))
            }
            result += func(post.usertext.substring(i, end))
            i = end - 1
            last_i = end
        }
    }
    
    if (i > last_i) {
        result += escapeHTML(post.usertext.substring(last_i, i))
    }
    
    return result
}