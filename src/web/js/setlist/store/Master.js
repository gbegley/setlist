Ext.define('setlist.store.Master',{
    extend : 'Ext.data.Store',
    requires : ['setlist.model.Song'],
    model : 'setlist.model.Song',
    data : [
//        {title:'Boxer',writer:'Paul Simon',time:'04:15'},
//        {title:'Deep River Blues',writer:'Delmor Bros',time:'05:10'},
//        {title:'Freight Train',writer:'Eliz. Cotton',time:'03:00'},
//        {title:'Guitar Rag',writer:'Merle Travis',time:'03:15'},
//        {title:'Got The Blues - Can\'t Be Satisfied',writer:'Mississippi John Hurt',time:'02:40'},
//        {title:'Hesitation Blues',writer:'Jorma Kaukonen',time:'04:40'}
    ],
    writeToLocalStorage : function(){
        var oRecs = [], recs = this.getRange();
        for(var r=0;r < recs.length; r++){
            oRecs.push( recs[r].raw );
        }
        var json = JSON.stringify(oRecs);

    }
});