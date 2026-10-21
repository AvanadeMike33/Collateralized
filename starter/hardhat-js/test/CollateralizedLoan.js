const {
  loadFixture,
  time,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { expect } = require("chai");
const { ethers } = require("hardhat");

// Describing a test suite for the CollateralizedLoan contrac
describe("CollateralizedLoan", function () {
  const COLLATERAL_AMOUNT = ethers.parseEther("2");
  const LOAN_AMOUNT = ethers.parseEther("1");

  
  const INTEREST_RATE = 500n;

  
  const LOAN_DURATION = 30 * 24 * 60 * 60;

  const LOAN_ID = 0n;

  async function deployCollateralizedLoanFixture() {
    const [owner, borrower, lender, otherAccount] =
      await ethers.getSigners();

    const CollateralizedLoan =
      await ethers.getContractFactory("CollateralizedLoan");

    const collateralizedLoan =
      await CollateralizedLoan.deploy();

    await collateralizedLoan.waitForDeployment();

    return {
      collateralizedLoan,
      owner,
      borrower,
      lender,
      otherAccount,
    };
  }

  async function createLoanFixture() {
    const fixture =
      await deployCollateralizedLoanFixture();

    const {
      collateralizedLoan,
      borrower,
    } = fixture;

    await collateralizedLoan
      .connect(borrower)
      .depositCollateralAndRequestLoan(
        INTEREST_RATE,
        LOAN_DURATION,
        {
          value: COLLATERAL_AMOUNT,
        }
      );

    return fixture;
  }

  async function fundedLoanFixture() {
    const fixture =
      await createLoanFixture();

    const {
      collateralizedLoan,
      lender,
    } = fixture;

    await collateralizedLoan
      .connect(lender)
      .fundLoan(LOAN_ID, {
        value: LOAN_AMOUNT,
      });

    return fixture;
  }

  describe("Deployment", function () {
    it("Deploys the contract successfully", async function () {
      const {
        collateralizedLoan,
      } = await loadFixture(
        deployCollateralizedLoanFixture
      );

      expect(
        await collateralizedLoan.getAddress()
      ).to.be.properAddress;

      expect(
        await collateralizedLoan.nextLoanId()
      ).to.equal(0n);
    });
  });

  describe("Loan Request", function () {
    it("Should let a borrower deposit collateral and request a loan", async function () {
      const {
        collateralizedLoan,
        borrower,
      } = await loadFixture(
        deployCollateralizedLoanFixture
      );

      await expect(
        collateralizedLoan
          .connect(borrower)
          .depositCollateralAndRequestLoan(
            INTEREST_RATE,
            LOAN_DURATION,
            {
              value: COLLATERAL_AMOUNT,
            }
          )
      )
        .to.emit(
          collateralizedLoan,
          "LoanRequested"
        )
        .withArgs(
          LOAN_ID,
          borrower.address,
          COLLATERAL_AMOUNT,
          LOAN_AMOUNT,
          INTEREST_RATE,
          LOAN_DURATION
        );

      const loan =
        await collateralizedLoan.loans(LOAN_ID);

      expect(loan.borrower).to.equal(
        borrower.address
      );

      expect(loan.lender).to.equal(
        ethers.ZeroAddress
      );

      expect(loan.collateralAmount).to.equal(
        COLLATERAL_AMOUNT
      );

      expect(loan.loanAmount).to.equal(
        LOAN_AMOUNT
      );

      expect(loan.interestRate).to.equal(
        INTEREST_RATE
      );

      expect(loan.isFunded).to.equal(false);
      expect(loan.isRepaid).to.equal(false);

      expect(
        await collateralizedLoan.nextLoanId()
      ).to.equal(1n);

      expect(
        await ethers.provider.getBalance(
          await collateralizedLoan.getAddress()
        )
      ).to.equal(COLLATERAL_AMOUNT);
    });

    it("Rejects a loan request without collateral", async function () {
      const {
        collateralizedLoan,
        borrower,
      } = await loadFixture(
        deployCollateralizedLoanFixture
      );

      await expect(
        collateralizedLoan
          .connect(borrower)
          .depositCollateralAndRequestLoan(
            INTEREST_RATE,
            LOAN_DURATION,
            {
              value: 0,
            }
          )
      ).to.be.revertedWith(
        "Collateral must be greater than zero"
      );
    });

    it("Rejects a loan with zero duration", async function () {
      const {
        collateralizedLoan,
        borrower,
      } = await loadFixture(
        deployCollateralizedLoanFixture
      );

      await expect(
        collateralizedLoan
          .connect(borrower)
          .depositCollateralAndRequestLoan(
            INTEREST_RATE,
            0,
            {
              value: COLLATERAL_AMOUNT,
            }
          )
      ).to.be.revertedWith(
        "Duration must be greater than zero"
      );
    });
  });

  describe("Funding a Loan", function () {
    it("Allows a lender to fund a requested loan", async function () {
      const {
        collateralizedLoan,
        borrower,
        lender,
      } = await loadFixture(
        createLoanFixture
      );

      const borrowerBalanceBefore =
        await ethers.provider.getBalance(
          borrower.address
        );

      await expect(
        collateralizedLoan
          .connect(lender)
          .fundLoan(LOAN_ID, {
            value: LOAN_AMOUNT,
          })
      )
        .to.emit(
          collateralizedLoan,
          "LoanFunded"
        );

      const borrowerBalanceAfter =
        await ethers.provider.getBalance(
          borrower.address
        );

      const loan =
        await collateralizedLoan.loans(LOAN_ID);

      expect(loan.lender).to.equal(
        lender.address
      );

      expect(loan.isFunded).to.equal(true);

      expect(
        borrowerBalanceAfter - borrowerBalanceBefore
      ).to.equal(LOAN_AMOUNT);

      // Only the collateral remains in the contract.
      expect(
        await ethers.provider.getBalance(
          await collateralizedLoan.getAddress()
        )
      ).to.equal(COLLATERAL_AMOUNT);
    });

    it("Rejects an incorrect funding amount", async function () {
      const {
        collateralizedLoan,
        lender,
      } = await loadFixture(
        createLoanFixture
      );

      await expect(
        collateralizedLoan
          .connect(lender)
          .fundLoan(LOAN_ID, {
            value: ethers.parseEther("0.5"),
          })
      ).to.be.revertedWith(
        "Incorrect funding amount"
      );
    });

    it("Prevents the borrower from funding their own loan", async function () {
      const {
        collateralizedLoan,
        borrower,
      } = await loadFixture(
        createLoanFixture
      );

      await expect(
        collateralizedLoan
          .connect(borrower)
          .fundLoan(LOAN_ID, {
            value: LOAN_AMOUNT,
          })
      ).to.be.revertedWith(
        "Borrower cannot fund own loan"
      );
    });

    it("Prevents the same loan from being funded twice", async function () {
      const {
        collateralizedLoan,
        otherAccount,
      } = await loadFixture(
        fundedLoanFixture
      );

      await expect(
        collateralizedLoan
          .connect(otherAccount)
          .fundLoan(LOAN_ID, {
            value: LOAN_AMOUNT,
          })
      ).to.be.revertedWith(
        "Loan is already funded"
      );
    });
  });

  describe("Repaying a Loan", function () {
    it("Enables the borrower to repay the loan fully", async function () {
      const {
        collateralizedLoan,
        borrower,
        lender,
      } = await loadFixture(
        fundedLoanFixture
      );

      const expectedInterest =
        (LOAN_AMOUNT * INTEREST_RATE) / 10_000n;

      const repaymentAmount =
        LOAN_AMOUNT + expectedInterest;

      expect(
        await collateralizedLoan.getRepaymentAmount(
          LOAN_ID
        )
      ).to.equal(repaymentAmount);

      const lenderBalanceBefore =
        await ethers.provider.getBalance(
          lender.address
        );

      const borrowerCollateralBalanceBefore =
        await ethers.provider.getBalance(
          borrower.address
        );

      await expect(
        collateralizedLoan
          .connect(borrower)
          .repayLoan(LOAN_ID, {
            value: repaymentAmount,
          })
      )
        .to.emit(
          collateralizedLoan,
          "LoanRepaid"
        )
        .withArgs(
          LOAN_ID,
          borrower.address,
          lender.address,
          repaymentAmount
        );

      const lenderBalanceAfter =
        await ethers.provider.getBalance(
          lender.address
        );

      const borrowerCollateralBalanceAfter =
        await ethers.provider.getBalance(
          borrower.address
        );

      const loan =
        await collateralizedLoan.loans(LOAN_ID);

      expect(loan.isRepaid).to.equal(true);
      expect(loan.collateralAmount).to.equal(0n);

      expect(
        lenderBalanceAfter - lenderBalanceBefore
      ).to.equal(repaymentAmount);

      expect(
        borrowerCollateralBalanceAfter
      ).to.be.greaterThan(
        borrowerCollateralBalanceBefore -
          repaymentAmount
      );

      expect(
        await ethers.provider.getBalance(
          await collateralizedLoan.getAddress()
        )
      ).to.equal(0n);
    });

    it("Rejects an incorrect repayment amount", async function () {
      const {
        collateralizedLoan,
        borrower,
      } = await loadFixture(
        fundedLoanFixture
      );

      await expect(
        collateralizedLoan
          .connect(borrower)
          .repayLoan(LOAN_ID, {
            value: LOAN_AMOUNT,
          })
      ).to.be.revertedWith(
        "Incorrect repayment amount"
      );
    });

    it("Prevents another account from repaying the loan", async function () {
      const {
        collateralizedLoan,
        otherAccount,
      } = await loadFixture(
        fundedLoanFixture
      );

      const repaymentAmount =
        await collateralizedLoan.getRepaymentAmount(
          LOAN_ID
        );

      await expect(
        collateralizedLoan
          .connect(otherAccount)
          .repayLoan(LOAN_ID, {
            value: repaymentAmount,
          })
      ).to.be.revertedWith(
        "Only borrower can repay"
      );
    });
  });

  describe("Claiming Collateral", function () {
    it("Permits the lender to claim collateral if the loan isn't repaid on time", async function () {
      const {
        collateralizedLoan,
        lender,
      } = await loadFixture(
        fundedLoanFixture
      );

      // Move blockchain time beyond the loan deadline.
      await time.increase(LOAN_DURATION + 1);

      const lenderBalanceBefore =
        await ethers.provider.getBalance(
          lender.address
        );

      const transaction =
        await collateralizedLoan
          .connect(lender)
          .claimCollateral(LOAN_ID);

      await expect(transaction)
        .to.emit(
          collateralizedLoan,
          "CollateralClaimed"
        )
        .withArgs(
          LOAN_ID,
          lender.address,
          COLLATERAL_AMOUNT
        );

      const receipt = await transaction.wait();

      const gasCost =
        receipt.gasUsed * receipt.gasPrice;

      const lenderBalanceAfter =
        await ethers.provider.getBalance(
          lender.address
        );

      expect(
        lenderBalanceAfter + gasCost
      ).to.equal(
        lenderBalanceBefore + COLLATERAL_AMOUNT
      );

      const loan =
        await collateralizedLoan.loans(LOAN_ID);

      expect(loan.collateralAmount).to.equal(0n);

      expect(
        await ethers.provider.getBalance(
          await collateralizedLoan.getAddress()
        )
      ).to.equal(0n);
    });

    it("Does not allow collateral to be claimed before the due date", async function () {
      const {
        collateralizedLoan,
        lender,
      } = await loadFixture(
        fundedLoanFixture
      );

      await expect(
        collateralizedLoan
          .connect(lender)
          .claimCollateral(LOAN_ID)
      ).to.be.revertedWith(
        "Loan is not past due"
      );
    });

    it("Prevents a non-lender from claiming collateral", async function () {
      const {
        collateralizedLoan,
        otherAccount,
      } = await loadFixture(
        fundedLoanFixture
      );

      await time.increase(LOAN_DURATION + 1);

      await expect(
        collateralizedLoan
          .connect(otherAccount)
          .claimCollateral(LOAN_ID)
      ).to.be.revertedWith(
        "Only lender can claim collateral"
      );
    });

    it("Prevents collateral from being claimed twice", async function () {
      const {
        collateralizedLoan,
        lender,
      } = await loadFixture(
        fundedLoanFixture
      );

      await time.increase(LOAN_DURATION + 1);

      await collateralizedLoan
        .connect(lender)
        .claimCollateral(LOAN_ID);

      await expect(
        collateralizedLoan
          .connect(lender)
          .claimCollateral(LOAN_ID)
      ).to.be.revertedWith(
        "Collateral already claimed"
      );
    });
  });
});