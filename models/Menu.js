module.exports = function (sequelize, DataTypes) {
    const Menu = sequelize.define("Menu", {
        item_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        item_desc: {
            type: DataTypes.STRING,
            allowNull: false
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: false
        },
        serve: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        availability: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        }

    })
    // Associate Users if merchants to Shops
    Menu.associate = function (models) {
        Menu.belongsTo(models.Shop, {
            foreignKey: {
                allowNull: true,
            },
        });

    }

    return Menu;
}