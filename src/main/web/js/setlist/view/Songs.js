Ext.define('setlist.view.Songs',{
    extend : 'Ext.grid.Panel',
    requires : 'setlist.model.Song',
    xtype:'songlist',
    cls : 'setlist-songs',
    dockedItems: [{
        dock: 'top',
        id : 'setListSummary',
        padding : 15,
        xtype: 'container',
        tpl : '<b>Summary:</b> {count} songs - <b>Time :</b> {minutes}:{seconds}'
    }],
    updateSummary : function(){
        var totalSeconds = 0;
        var re = /(\d+):(\d+)/;
        this.store.each(function(rec){
            var t = rec.get('time');
            var m = t.match(re);
            var mms = parseInt( m[1] ) * 60;
            var mss = parseInt( m[2] );
            var songTime = mms + mss;
            totalSeconds += songTime;
        });
        Ext.getCmp('setListSummary').update({count:this.store.getCount(),seconds:totalSeconds % 60, minutes: Math.round(totalSeconds/60)});
    },
    columns : [
        {text:'Title',dataIndex:'title',flex:1},
        {text:'Writer',dataIndex:'writer'},
        {text:'Time',dataIndex:'time'}
    ],
    initComponent : function(  ) {

        var me = this;
        me.addEvents('songadded','songremoved','datachanged');

        if(!me.store) me.store = Ext.create('Ext.data.Store',{
            model : 'setlist.model.Song',
            data : []
        });
        me.store.on('datachanged',function(store){
            me.updateSummary();
        });

        me.addSong = function( song ) {
            me.store.add( song );
            me.fireEvent('songadded',me,song);
        };

        me.removeSong = function( index ) {
            me.store.removeAt( index );
            me.fireEvent('songremoved',me,song);
        };

        me.callParent(arguments);
    }
});