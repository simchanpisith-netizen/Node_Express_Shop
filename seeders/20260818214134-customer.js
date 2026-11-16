'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
        await queryInterface.bulkInsert("Customers", [
          {
            firstName: 'John Doe',
            lastName: "Dy",
            phone:"012867897",
            username:"John",
            email:"John@gmail.com",
            password:"12345",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            firstName: 'Sal',
            lastName: "Day",
            phone:"012867897",
            username:"Sal",
            email:"JohnSAl@gmail.com",
            password:"12345",
            createdAt: new Date(),
            updatedAt: new Date(),
          }
         ], 
      {});
    
   
    

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Customers', null, {});
  }
};
