module.exports = function (sequelize, DataTypes) {
    const Shop = sequelize.define("Shop", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 15]
            }
        },
        balance: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0

        }, category: {
            type: DataTypes.STRING,
            allowNull: false
        }

    })
    // Associate Users if merchants to Shops
    Shop.associate = function (models) {
        Shop.hasMany(models.User)
        Shop.hasMany(models.Menu)
        Shop.hasMany(models.Order)
    };

    return Shop;
}