module.exports = function (sequelize, DataTypes) {
    const Order = sequelize.define("Order", {
        order_custom_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        item_qty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
        ,
        order_status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'paid'
        },
        order_total: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    })
    // Associate Users if merchants to Shops
    Order.associate = function (models) {

        Order.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
            },
        });
        Order.belongsTo(models.Shop, {
            foreignKey: {
                allowNull: false,
            },
        });
        Order.belongsTo(models.Transaction, {
            foreignKey: {
                allowNull: false,
            },
        });
        Order.belongsTo(models.Menu, {
            foreignKey: {
                allowNull: false,
            },
        });
    }

    return Order;
}