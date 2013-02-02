
// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {
    // Receipt verification (https://github.com/mozilla/receiptverifier)
    require('receiptverifier');

    // Installation button
    require('./install-button');

    // Install the layouts
    require('layouts/layouts');

    // Write your app here.


    function formatDate(d) {
        return (d.getMonth()+1) + '/' +
            d.getDate() + '/' +
            d.getFullYear();
    }

    // List view

    var list = $('.list').get(0);
    

    // Detail view

    var detail = $('.detail').get(0);
    detail.render = function(item) {
        $('.user', this).html(item.get('user'));
        $('.password', this).text(item.get('password'));
    };

    // Edit view

    var edit = $('.edit').get(0);
    edit.render = function(item) {
        item = item || { id: '', get: function() { return ''; } };

        $('input[name=site]', this).val(item.title);
        $('input[name=user]', this).val(item.get('user'));
        $('input[name=password]', this).val(item.get('password'));
    };

    edit.getTitle = function() {
        var model = this.view.model;

        if(model) {
            return model.get('title');
        }
        else {
            return 'New';
        }
    };

    $('button.add', edit).click(function() {
        var el = $(edit),
			title = el.find('input[name=site]'),
			user = el.find('input[name=user]'),
			pwd = el.find('input[name=password]');
			
        var model = edit.model;

        if(model) {
            model.set({ 
				title: title.val(), 
				user: user.val(), 
				password: pwd.val()
			});
        } else {
            list.add({ 
				title: title.val(),
                user: user.val(),
               	password: pwd.val()
			});
        }

        edit.close();
    });
	

    $('button.delete', detail).click(function() {
		console.log(list);
    });
});