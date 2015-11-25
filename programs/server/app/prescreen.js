(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// prescreen.js                                                        //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Screens = new Meteor.Collection('screens');                            // 1
Forms = new Meteor.Collection('forms');                                // 2
NewScreen = new Meteor.Collection('newscreen');                        // 3
                                                                       //
Router.route('/', function () {                                        // 5
  this.render("Home");                                                 // 6
});                                                                    //
                                                                       //
Router.route('/forms', function () {                                   // 9
  this.render("ManageForms");                                          // 10
});                                                                    //
                                                                       //
Router.route('/screens/:_id', {                                        // 13
  name: 'StoredScreen',                                                // 14
  data: function () {                                                  // 15
    return Screens.findOne({ _id: this.params._id });                  // 16
  }                                                                    //
});                                                                    //
                                                                       //
Router.route('/forms/:_id', {                                          // 20
  name: 'BlankForm',                                                   // 21
  data: function () {                                                  // 22
    return NewScreen.findOne({ _id: this.params._id });                // 23
  }                                                                    //
});                                                                    //
                                                                       //
Router.route('/manage/:_id', {                                         // 27
  name: 'ManageForm',                                                  // 28
  data: function () {                                                  // 29
    return Forms.findOne({ _id: this.params._id });                    // 30
  }                                                                    //
});                                                                    //
                                                                       //
if (Meteor.isClient) {                                                 // 34
                                                                       //
  Template.ScreensPanel.helpers({                                      // 36
    items: function () {                                               // 37
      return Screens.find();                                           // 38
    }                                                                  //
  });                                                                  //
                                                                       //
  Template.ManageForm.helpers({                                        // 42
    items: function () {                                               // 43
      return Forms.find();                                             // 44
    }                                                                  //
  });                                                                  //
                                                                       //
  Template.ManageForms.helpers({                                       // 48
    items: function () {                                               // 49
      return Forms.find();                                             // 50
    }                                                                  //
  });                                                                  //
                                                                       //
  Template.BlankForm.helpers({                                         // 54
    items: function () {                                               // 55
      return Forms.find();                                             // 56
    }                                                                  //
  });                                                                  //
                                                                       //
  Template.BlankForm.onRendered(function () {                          // 60
    $('input')[0].value = this.data.first;                             // 61
    for (i = 0; i < this.data.answers.length; i++) {                   // 62
      $('textarea')[i].value = this.data.answers[i];                   // 63
    }                                                                  //
  });                                                                  //
                                                                       //
  Template.ScreensPanel.events({                                       // 67
    'click .delete': function () {                                     // 68
      check_delete = confirm("Are you sure?");                         // 69
      if (check_delete == true) {                                      // 70
        Screens.remove(this._id);                                      // 71
      }                                                                //
    }                                                                  //
  });                                                                  //
                                                                       //
  Template.BlankForm.events({                                          // 76
    'click [name=submit]': function (e, tmpl) {                        // 77
      e.preventDefault();                                              // 78
                                                                       //
      var newObj = {};                                                 // 80
      var q_elements = $('.question-form li');                         // 81
      var a_elements = $('textarea');                                  // 82
      var ca_elements = $('.correct-answer');                          // 83
      var qa_bundle = [];                                              // 84
                                                                       //
      for (i = 0; i < q_elements.length; i++) {                        // 86
        myObj = {};                                                    // 87
        myObj['question'] = q_elements[i].innerHTML;                   // 88
        myObj['answer'] = a_elements[i + 1].value;                     // 89
        myObj['correct_answer'] = ca_elements[i].innerHTML.split('</b> ')[1];
        qa_bundle.push(myObj);                                         // 91
      }                                                                //
                                                                       //
      newObj['name'] = $('input')[0].value;                            // 94
      newObj['prescreen_notes'] = $('#prescreen-notes')[0].value;      // 95
      newObj['role'] = this.position_name;                             // 96
      newObj['qa_bundle'] = qa_bundle;                                 // 97
      newObj['created_at'] = new Date();                               // 98
                                                                       //
      Screens.insert(newObj);                                          // 101
                                                                       //
      for (i = 0; i < $('input').length; i++) {                        // 103
        $('input')[i].value = '';                                      // 104
      }                                                                //
                                                                       //
      for (i = 0; i < $('textarea').length; i++) {                     // 107
        $('textarea')[i].value = '';                                   // 108
      }                                                                //
                                                                       //
      $('#new-id')[0].innerHTML = 'Link to candidate prescreen: <a href="/screens/' + Screens.find().fetch()[Screens.find().fetch().length - 1]._id + '">' + Screens.find().fetch()[Screens.find().fetch().length - 1]._id + '</a>';
                                                                       //
      NewScreen.remove({ _id: window.location.pathname.split('/')[window.location.pathname.split('/').length - 1] });
    },                                                                 //
                                                                       //
    'change [id="on-change"]': function (e, tmpl) {                    // 116
      var screen_data = [];                                            // 117
      var name = $('input')[0].value;                                  // 118
      for (i = 0; i < $('textarea').length; i++) {                     // 119
        screen_data.push($('textarea')[i].value);                      // 120
      }                                                                //
                                                                       //
      Session.set("updateNewScreen", this._id);                        // 123
                                                                       //
      NewScreen.update(Session.get("updateNewScreen"), { $set: {       // 125
          answers: screen_data,                                        // 129
          first: name                                                  // 130
        }                                                              //
      });                                                              //
      console.log(screen_data);                                        // 133
    }                                                                  //
  });                                                                  //
                                                                       //
  Template.ManageForm.events({                                         // 137
    'click [name=submit_new]': function (e, tmpl) {                    // 138
      e.preventDefault();                                              // 139
                                                                       //
      var question = tmpl.find('textarea[name=new_question]').value;   // 141
      var correct_answer = tmpl.find('textarea[name=new_answer]').value;
      var qa_index = Forms.findOne({ _id: window.location.href.split('manage/')[1] }).form_bundle.length;
                                                                       //
      var bundle_array = Forms.findOne({ _id: window.location.href.split('manage/')[1] }).form_bundle;
      bundle_array.push({ question: question, correct_answer: correct_answer, qa_index: qa_index });
      var new_bundle = bundle_array;                                   // 147
                                                                       //
      Session.set("updateForm", this._id);                             // 149
                                                                       //
      var form_bundle = new_bundle;                                    // 151
                                                                       //
      Forms.update(Session.get("updateForm"), { $set: {                // 153
          form_bundle: form_bundle                                     // 157
        }                                                              //
      });                                                              //
                                                                       //
      $('.new-question')[0].value = '';                                // 161
      $('.new-question')[1].value = '';                                // 162
    },                                                                 //
                                                                       //
    'click .delete': function (e, tmpl) {                              // 165
      e.preventDefault;                                                // 166
      var bundle_array = Forms.findOne({ _id: window.location.href.split('manage/')[1] }).form_bundle;
      bundle_array.splice(this.qa_index, 1);                           // 168
      for (i = 0; i < bundle_array.length; i++) {                      // 169
        bundle_array[i]['qa_index'] = i;                               // 170
      }                                                                //
                                                                       //
      Session.set("updateForm", window.location.href.split('manage/')[1]);
      var new_bundle = bundle_array;                                   // 174
      console.log(new_bundle);                                         // 175
                                                                       //
      Forms.update(Session.get("updateForm"), { $set: {                // 177
          form_bundle: new_bundle                                      // 181
        }                                                              //
      });                                                              //
    },                                                                 //
                                                                       //
    'keypress .new-question': function (e, tmpl) {                     // 186
      if (e.keyCode == 13) {                                           // 187
        $('#submit-new').click();                                      // 188
      }                                                                //
    }                                                                  //
  });                                                                  //
                                                                       //
  Template.ManageForms.events({                                        // 193
    'click [name=submit_new]': function (e, tmpl) {                    // 194
      e.preventDefault();                                              // 195
                                                                       //
      var position_name = $('#position-name')[0].value;                // 197
                                                                       //
      Forms.insert({                                                   // 199
        position_name: position_name,                                  // 200
        form_bundle: [],                                               // 201
        created_at: new Date()                                         // 202
      });                                                              //
                                                                       //
      $('#position-name')[0].value = '';                               // 205
      $('#form-confirmation')[0].innerHTML = '"' + Forms.find().fetch()[Forms.find().fetch().length - 1].position_name + '" has been created. Manage it <a href="/manage/' + Forms.find().fetch()[Forms.find().fetch().length - 1]._id + '">here</a>.';
    },                                                                 //
                                                                       //
    'click [name=edit]': function (e, tmpl) {                          // 209
      e.preventDefault();                                              // 210
                                                                       //
      window.location = '/manage/' + this._id;                         // 212
    },                                                                 //
                                                                       //
    'click [name=delete]': function (e, tmpl) {                        // 215
      e.preventDefault();                                              // 216
      ask = confirm('Are you sure?');                                  // 217
      if (ask === true) {                                              // 218
        Forms.remove(this._id);                                        // 219
      }                                                                //
    },                                                                 //
                                                                       //
    'click [name=new-screen]': function (e, tmpl) {                    // 223
      NewScreen.insert({                                               // 224
        first: '',                                                     // 225
        role: this.position_name,                                      // 226
        answers: [],                                                   // 227
        form_id: this._id,                                             // 228
        position_name: this.position_name,                             // 229
        form_bundle: this.form_bundle,                                 // 230
        created_at: new Date()                                         // 231
      });                                                              //
                                                                       //
      window.location = '/forms/' + NewScreen.find().fetch()[NewScreen.find().fetch().length - 1]._id;
    },                                                                 //
                                                                       //
    'keypress #position-name': function (e, tmpl) {                    // 237
      if (e.keyCode == 13) {                                           // 238
        $('#submit-new').click();                                      // 239
      }                                                                //
    }                                                                  //
  });                                                                  //
}                                                                      //
                                                                       //
if (Meteor.isServer) {}                                                // 245
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=prescreen.js.map
