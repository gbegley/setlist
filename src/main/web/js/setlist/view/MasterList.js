Ext.define('setlist.view.MasterList',{
    extend : 'Ext.grid.Panel',
    xtype : 'masterlist',
    cls : 'setlist-master',
    columns : [
        {xtype:'rownumberer'},
        {text:'Title',dataIndex:'title',flex:1},
        {text:'Writer',dataIndex:'writer'},
        {text:'Time',dataIndex:'time'}
    ],
    initComponent : function(){
        var me = this;
        me.addEvents( 'loaded' );

        me.store = Ext.create('setlist.store.Master',{
            storeId : 'master'
        });
        me.store.on('load',function(){me.fireEvent('loaded',me,me.store)})

        me.callParent(arguments);
    }
});