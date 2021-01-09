module.exports = function (sequelize, DataTypes) {
    const Transaction = sequelize.define("Transaction", {
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,

        },

    })
    // Associate Users if merchants to Shops
    Transaction.associate = function (models) {
        Transaction.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
            },
        });
        Transaction.belongsTo(models.Order, {
            foreignKey: {
                allowNull: false,
            },
        });
        Transaction.belongsTo(models.Shop, {
            foreignKey: {
                allowNull: false,
            },
        });
    }

    return Transaction;
}