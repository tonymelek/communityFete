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
        item_pic: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isOnGoogleDrive(value) {
                    if (!(/https:\/\/drive.google.com\/(.)+/g).test(value)) {
                        throw new Error('Picture is not Stored on Google Drive')
                    }
                }
            }
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
        }

    })
    // Associate Users if merchants to Shops
    Menu.associate = function (models) {
        Menu.belongsTo(models.Shop, {
            foreignKey: {
                allowNull: true,
            },
        });
        Menu.hasMany(models.Order);

    }

    return Menu;
}