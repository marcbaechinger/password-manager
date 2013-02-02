
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


	var secret,
		getSecret = function () {
			if (!secret) {
				secret = prompt("Enter the secret for encryption");
			}
			return secret;
		},
		loadData = function (collection) {
			console.log("loadData");
			var items = [], i, storedData;
			if (localStorage.passwords) {
				console.log("loadData: data available");
				try {
					storedData = JSON.parse(sjcl.decrypt(getSecret(), localStorage.passwords));
				} catch (e) {
					alert("decryption failed. Probably your secret is wrong.");
				}
				for (i = 0; i < storedData.length; i++) {
					collection.add(storedData[i]);
				}
			}
		},
		storeData = function (data) {
			var textRepresentation = JSON.stringify(data),
				encryptedRepresentation = sjcl.encrypt(getSecret(), textRepresentation);
				
			localStorage.passwords = encryptedRepresentation;
		};

    // List view

    var list = $('.list').get(0),
		selectedItem;
    
	loadData(list.collection);

    // Detail view

    var detail = $('.detail').get(0);
    detail.render = function(item) {
		selectedItem = item;
        $('.user', this).html(item.get('user'));
        $('.password', this).text(item.get('password'));
    };

    // Edit view

    var edit = $('.edit').get(0);
    edit.render = function(item) {
        item = item || { id: '', get: function() { return ''; } };

        $('input[name=site]', this).val(item.get('title'));
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

	$("p.password", detail).click(function (e) {
		var target = $(e.target);
		target.addClass("password-unveiled");
		setTimeout(function () {
			target.removeClass("password-unveiled");
		}, 10 * 1000);
	});
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
		storeData(list.collection.toJSON());
        edit.close();
    });
	
	$("button.dropSecret", list).click(function () {
		secret = undefined;
		alert("secret dropped");
	});
	

    $('button.delete', detail).click(function() {
		var title = selectedItem.get("title"), item, i;

		console.log(title);
		
		for (i = 0; i < list.collection.length; i++) {
			item = list.collection.at(i);
			if (item.get("title") === title) {
				list.collection.remove(item);
				storeData(list.collection.toJSON());
				break;
			}
		}
        detail.close();
		list.view.render();
    });
});